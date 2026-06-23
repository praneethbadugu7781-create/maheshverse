require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Property = require("./models/Property");
const Admin = require("./models/Admin");

const MOCK_PROPERTIES = [
  {
    title: "River flat for rental",
    description: "Experience modern waterfront living in this gorgeous river flat. Situated in a prime downtown residential zone, this apartment features an open-concept living area, fully integrated modular kitchen with top-tier appliances, and a private balcony overlooking panoramic water views. Ideal for professionals and families seeking a serene yet central lifestyle. Residents receive access to underground garage parking, full power backup, an infinity pool, and a high-end clubhouse.",
    location: "Downtown Riverway, Hyderabad",
    price: 155000,
    category: "Flats",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-suburban-neighborhood-42289-large.mp4",
    images: [
      "/images/VyEwdjyihPrLj2HrHeFBCultWQ472b.jpg",
      "/images/VyEwdjyihPrLj2HrHeFBCultWQ591b.jpg",
    ],
    highlights: [
      "Panoramic River Views",
      "Fully Furnished Kitchen",
      "Underground Reserved Parking",
      "Gym & Infinity Pool Access",
      "Double-Glazed Soundproof Windows",
    ],
    specifications: {
      "Configuration": "2 BHK Flat",
      "Bathrooms": "2 Bathrooms",
      "Super Area": "1,450 Sq. Ft.",
      "Facing": "North-East Facing",
      "Age of Property": "Brand New",
      "Monthly Maintenance": "₹4,500",
    },
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15227.185695029377!2d78.3976527!3d17.4265439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c0cf9419eb%3A0xc3f8e5f1b1eb8894!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
    isFeatured: true,
    metaTitle: "River Flat for Rent in Downtown Riverway | Mahesh Verse",
    metaDescription: "Explore this stunning 2 BHK River Flat for rent at ₹1,55,000/mo. Premium amenities, river view, fully furnished. Contact Mahesh today.",
  },
  {
    title: "Beach villa for lease",
    description: "A spectacular beachfront villa located along the scenic East Coast Road. Enjoy direct, private access to sandy shores, expansive double-height ceilings, and an open sun deck with a private beachfront swimming pool. This architectural masterpiece seamlessly blends indoor and outdoor coastal living. Built to satisfy the highest standards of luxury, privacy, and aesthetic excellence. Includes separate servant quarters and dedicated security control.",
    location: "East Coast Road, Chennai",
    price: 160000,
    category: "Houses",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-luxury-home-41580-large.mp4",
    images: [
      "/images/Pmtlf2i0BsTx59OyI1lITu3GaE472b.jpg",
      "/images/U0333cSYHujby9A7c46Fl9Ty1ecbda8.jpg",
    ],
    highlights: [
      "Direct Private Beach Access",
      "Private Beachfront Pool",
      "Double-Height Ceiling Lounge",
      "ECR Coastal Drive Proximity",
      "Servant Quarters & Multi-Car Garage",
    ],
    specifications: {
      "Configuration": "4 BHK Beach Villa",
      "Bathrooms": "4 Bathrooms",
      "Super Area": "3,800 Sq. Ft.",
      "Facing": "East Facing (Sea View)",
      "Lease Tenure": "Minimum 2 Years",
      "Age of Property": "Ready to Occupy",
    },
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31117.84277727181!2d80.245053!3d12.8606821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525c3866164dfb%3A0xc3f8e5f1b1eb8894!2sEast%20Coast%20Road%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1680000000003!5m2!1sen!2sin",
    isFeatured: true,
    metaTitle: "Luxury 4 BHK Beach Villa for Lease on ECR Chennai | Mahesh Verse",
    metaDescription: "Exquisite beachfront 4 BHK Villa with private pool for lease on ECR Chennai. Watch video reel walkthrough and book tour.",
  },
  {
    title: "Penthouse in downtown",
    description: "This premium high-rise penthouse stands tall above the city's financial heart. Flooded with natural light via massive floor-to-ceiling glass walls, this home has a private wrap-around terrace offering unobstructed sunset views of the city skyline. Outfitted with bespoke luxury finishes, automated lighting/blinds, private elevators, and high-end built-in kitchen appliances. Represents the absolute pinnacle of high-rise urban living.",
    location: "Financial District, Hyderabad",
    price: 200000,
    category: "Flats",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-kitchen-in-a-modern-home-41583-large.mp4",
    images: [
      "/images/2uEuPHlDTA0p49iaBVjRJWHphU3e69.png",
      "/images/VyEwdjyihPrLj2HrHeFBCultWQ472b.jpg",
    ],
    highlights: [
      "Floor-to-ceiling Glass Walls",
      "Breathtaking Skyline Terrace",
      "Integrated Smart Automation",
      "Private Secure Elevators",
      "MNC Pre-leased Option",
    ],
    specifications: {
      "Configuration": "3 BHK Penthouse",
      "Bathrooms": "3.5 Bathrooms",
      "Super Area": "2,850 Sq. Ft.",
      "Facing": "West Facing (Sunset View)",
      "Furnishing": "Fully Furnished",
      "Security Deposit": "6 Months Rent",
    },
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15225.875249567954!2d78.3725612!3d17.4514217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dfd68a2bf1%3A0xc3f8e5f1b1eb8894!2sHitec%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000004!5m2!1sen!2sin",
    isFeatured: true,
    metaTitle: "Downtown Luxury Penthouse for Rent in Financial District | Mahesh Verse",
    metaDescription: "Exquisite 3 BHK Penthouse in Financial District Hyderabad. Panoramic views, sky deck, premium specifications. Enquire for site tour.",
  },
  {
    title: "Quiet hillside retreat",
    description: "Escape the city hubbub in this eco-friendly hillside cottage. Located inside a gated nature community, this property features organic mango and guava trees, a stone fireplace deck, private fresh water well, and rustic luxury interiors. Perfect as a weekend getaway cottage or a peaceful retirement asset. Features solar power integration and a dedicated drip water setup.",
    location: "Hillside Enclave, Ananthagiri",
    price: 150000,
    category: "Lands",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-suburban-neighborhood-42289-large.mp4",
    images: [
      "/images/ZC3LSrOJhu9P6sDvk10hhCtkps472b.jpg",
    ],
    highlights: [
      "Panoramic Hillside Overlook",
      "Outdoor Stone Fireplace Deck",
      "Organic Mango & Guava Orchards",
      "Solar Power & Drip Water Grid",
      "24/7 Gated Nature Sanctuary",
    ],
    specifications: {
      "Configuration": "2 BHK Country Cottage",
      "Bathrooms": "2 Bathrooms",
      "Super Area": "1,800 Sq. Ft. (Built-up)",
      "Total Land Area": "0.5 Acres (21,780 Sq. Ft.)",
      "Facing": "South Facing",
      "Zoning": "Agricultural Gated Cottage",
    },
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3811.23847727181!2d78.397053!3d17.2456821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb998eb%3A0xc3f8e5f1b1eb8894!2sShamshabad%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000005!5m2!1sen!2sin",
    isFeatured: false,
    metaTitle: "Gated Hillside Cottage for Sale Ananthagiri | Mahesh Verse",
    metaDescription: "Buy a premium 2 BHK Hillside Retreat cottage inside Ananthagiri Gated Sanctuary. Fresh air, organic trees, clear title deed. Learn pricing.",
  },
  {
    title: "Modern flat for rent",
    description: "An ultra-sleek, modern apartment in Hyderabad's core IT corridor. Boasts premium imported marble flooring, modular kitchen cabinets, centralized VRV air conditioning, double-glazed window frames, and modular washroom fittings. Offers close proximity to leading global IT parks, international schools, metro stations, and upscale dining hubs. Currently pre-leased to an IT MNC.",
    location: "Hitech City, Hyderabad",
    price: 210000,
    category: "Flats",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-kitchen-in-a-modern-home-41583-large.mp4",
    images: [
      "/images/1v6XAWR21CWuDIr2BOjzJfrK58g1590.jpg",
    ],
    highlights: [
      "Centralized VRV Air Conditioning",
      "Imported Italian Marble Floors",
      "2-Car Reserved Basements Parking",
      "Pre-leased IT MNC Tenant (High Yield)",
      "Proximity to Hitech City Metro",
    ],
    specifications: {
      "Configuration": "3 BHK Flat",
      "Bathrooms": "3 Bathrooms",
      "Super Area": "2,250 Sq. Ft.",
      "Facing": "East Facing",
      "Age of Property": "1 Year Old",
      "Furnishing": "Semi-Furnished",
    },
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15225.875249567954!2d78.3725612!3d17.4514217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93dfd68a2bf1%3A0xc3f8e5f1b1eb8894!2sHitec%20City%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000004!5m2!1sen!2sin",
    isFeatured: false,
    metaTitle: "Pre-Leased 3 BHK Apartment Hitech City | Mahesh Verse",
    metaDescription: "Modern 3 BHK Flat for Rent in Hitech City. Semi-furnished, imported marble, premium VRV AC. High yield investment details available.",
  },
  {
    title: "Urban condo with view",
    description: "A sophisticated urban condominium offering panoramic city skyline views from the rooftop lounge. Centrally located in Banjara Hills, this condo features customized interior setups, modular lighting control, multi-layered firewall security, and a rooftop sky lounge. Provides extreme walkability to prominent luxury shopping malls and five-star hotels.",
    location: "Banjara Hills, Hyderabad",
    price: 175000,
    category: "Flats",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-suburban-neighborhood-42289-large.mp4",
    images: [
      "/images/ULoNCOhoLeAOnsYcoEXzAl1ySg84d7.jpg",
    ],
    highlights: [
      "Rooftop Sky Lounge Access",
      "Integrated Fire safety Systems",
      "Skyline Panoramic Balcony",
      "Excellent Rental Yield Asset",
      "Walkable to Banjara Luxury Malls",
    ],
    specifications: {
      "Configuration": "2 BHK Condo",
      "Bathrooms": "2 Bathrooms",
      "Super Area": "1,350 Sq. Ft.",
      "Facing": "North Facing",
      "Age of Property": "Brand New",
      "Monthly Maintenance": "₹3,800",
    },
    googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15227.185695029377!2d78.3976527!3d17.4265439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90c0cf9419eb%3A0xc3f8e5f1b1eb8894!2sJubilee%20Hills%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin",
    isFeatured: true,
    metaTitle: "High Yield 2 BHK Condo in Banjara Hills | Mahesh Verse",
    metaDescription: "Purchase high-yield 2 BHK Condo in Banjara Hills. Rooftop sky lounge, premium specifications, city skyline views. Read details.",
  },
];

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set!");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear and Seed Admin
    await Admin.deleteMany({});
    const passwordHash = await bcrypt.hash("admin123", 10);
    const defaultAdmin = new Admin({
      username: "admin",
      passwordHash: passwordHash
    });
    await defaultAdmin.save();
    console.log("Seeded default admin (username: admin, password: admin123)");

    // Clear and Seed Properties
    await Property.deleteMany({});
    for (const prop of MOCK_PROPERTIES) {
      const slug = prop.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const newProperty = new Property({ ...prop, slug });
      await newProperty.save();
    }
    console.log(`Seeded ${MOCK_PROPERTIES.length} properties!`);

    mongoose.connection.close();
    console.log("Seeding complete and database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
