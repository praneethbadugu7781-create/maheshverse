require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const Property = require("./models/Property");
const Lead = require("./models/Lead");
const Admin = require("./models/Admin");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "mahesh_verse_fallback_secret_key";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup upload folders
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// CORS Config
const allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(","));
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadDir));

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected successfully to Atlas!");
    // Auto-seed if database is empty
    const count = await Property.countDocuments();
    if (count === 0) {
      console.log("Properties collection empty. Seeding database automatically...");
      const exec = require("child_process").exec;
      exec("node seeder.js", (err, stdout, stderr) => {
        if (err) console.error("Auto-seed error:", err);
        else console.log(stdout);
      });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

// Root Endpoint landing page
app.get("/", (req, res) => {
  res.json({
    status: "active",
    message: "Mahesh Verse Premium Real Estate API Server",
    database: "Connected to MongoDB Atlas successfully",
    documentation: {
      properties: "/api/properties",
      auth_check: "/api/auth/me",
      leads: "/api/leads (protected)"
    }
  });
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false, message: "Unauthorized token session" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ authenticated: false, message: "Invalid session credentials" });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTINGS ---
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({ username });
    if (!admin) {
      // In case seeder hasn't run, create a default admin
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0 && username === "admin") {
        const hash = await bcrypt.hash(password, 10);
        admin = new Admin({ username: "admin", passwordHash: hash });
        await admin.save();
      } else {
        return res.status(400).json({ success: false, message: "Invalid admin username" });
      }
    }

    const validPass = await bcrypt.compare(password, admin.passwordHash);
    if (!validPass) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    
    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // development localhost
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ success: true, username: admin.username });
  } catch (error) {
    console.error("Login error detail:", error);
    res.status(500).json({ success: false, message: "Authentication server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ authenticated: false });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.json({ authenticated: false });
    res.json({ authenticated: true, username: user.username });
  });
});

// --- PROPERTIES ROUTINGS ---
app.get("/api/properties", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
    const list = await Property.find(query).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties" });
  }
});

app.get("/api/properties/:idOrSlug", async (req, res) => {
  try {
    const param = req.params.idOrSlug;
    const isObjectId = mongoose.Types.ObjectId.isValid(param);
    
    let prop;
    if (isObjectId) {
      prop = await Property.findById(param);
    } else {
      prop = await Property.findOne({ slug: param });
    }
    
    if (!prop) return res.status(404).json({ message: "Property not found" });
    res.json(prop);
  } catch (error) {
    res.status(500).json({ message: "Error fetching property details" });
  }
});

app.post("/api/properties", authenticateToken, async (req, res) => {
  try {
    const data = req.body;
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const newProperty = new Property({ ...data, slug });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: "Error creating property" });
  }
});

app.put("/api/properties/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    let updateData = { ...data };
    
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    
    const updated = await Property.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Property not found to update" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating property" });
  }
});

app.delete("/api/properties/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Property not found to delete" });
    res.json({ success: true, message: "Property deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting property" });
  }
});

// --- LEADS ROUTINGS ---
app.get("/api/leads", authenticateToken, async (req, res) => {
  try {
    const list = await Lead.find()
      .populate("propertyId", "title location price")
      .sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leads" });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const data = req.body;
    const leadData = { ...data };
    
    // Validate propertyId
    if (leadData.propertyId && mongoose.Types.ObjectId.isValid(leadData.propertyId)) {
      leadData.propertyId = new mongoose.Types.ObjectId(leadData.propertyId);
    } else {
      delete leadData.propertyId;
    }
    
    const newLead = new Lead(leadData);
    await newLead.save();
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ message: "Error creating lead entry" });
  }
});

app.put("/api/leads/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updated = await Lead.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Lead not found to update" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating lead status" });
  }
});

app.delete("/api/leads/:id", authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Lead not found to delete" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lead" });
  }
});

// --- FILE UPLOADS ROUTINGS ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post("/api/upload", authenticateToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // Check if Cloudinary credentials are set in environment
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mahesh_verse_uploads"
      });
      // Delete temporary local file
      fs.unlinkSync(req.file.path);
      return res.json({ fileUrl: result.secure_url });
    } else {
      const fileUrl = `/uploads/${req.file.filename}`;
      return res.json({ fileUrl });
    }
  } catch (error) {
    console.error("File upload error:", error);
    // Clean up temporary local file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Cleanup error:", err);
      }
    }
    res.status(500).json({ message: "Error uploading file" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server active on port ${PORT}`);
});
