"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Upload, X, ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import { formatPrice } from "@/components/PropertyCard";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // View state: 'list', 'add', 'edit'
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: 0,
    category: "Lands",
    videoUrl: "",
    images: [] as string[],
    highlights: [] as string[],
    specifications: {} as Record<string, string>,
    googleMapUrl: "",
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
  });

  // Media uploading states
  const [uploadingMedia, setUploadingMedia] = useState<string | null>(null); // 'video' or 'image'

  // Dynamic spec/highlight helpers
  const [newHighlight, setNewHighlight] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/properties");
      if (!res.ok) throw new Error("Failed to fetch properties.");
      const data = await res.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message || "Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();

    // Check query params to auto-open add form (for quick actions)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("action") === "add") {
        handleOpenAdd();
      }
    }
  }, []);

  const handleOpenAdd = () => {
    setForm({
      title: "",
      description: "",
      location: "",
      price: 0,
      category: "Lands",
      videoUrl: "",
      images: [],
      highlights: [],
      specifications: {},
      googleMapUrl: "",
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
    });
    setNewHighlight("");
    setSpecKey("");
    setSpecVal("");
    setView("add");
  };

  const handleOpenEdit = (property: any) => {
    setEditingId(property._id);
    setForm({
      title: property.title || "",
      description: property.description || "",
      location: property.location || "",
      price: property.price || 0,
      category: property.category || "Lands",
      videoUrl: property.videoUrl || "",
      images: property.images || [],
      highlights: property.highlights || [],
      specifications: property.specifications || {},
      googleMapUrl: property.googleMapUrl || "",
      isFeatured: !!property.isFeatured,
      metaTitle: property.metaTitle || "",
      metaDescription: property.metaDescription || "",
    });
    setNewHighlight("");
    setSpecKey("");
    setSpecVal("");
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property? This action is permanent.")) return;
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete property.");
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      alert("Error deleting property: " + err.message);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!form.title || !form.description || !form.location || !form.price || !form.videoUrl) {
      alert("Please fill in all required fields (Title, Description, Location, Price, Video URL).");
      return;
    }

    const url = view === "add" ? "/api/properties" : `/api/properties/${editingId}`;
    const method = view === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save property.");

      setView("list");
      fetchProperties();
    } catch (err: any) {
      alert("Error saving property: " + err.message);
    }
  };

  // Handle Media File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "video" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(type);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload file.");

      if (type === "video") {
        setForm((prev) => ({ ...prev, videoUrl: data.url }));
      } else {
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (err: any) {
      alert("Upload error: " + err.message);
    } finally {
      setUploadingMedia(null);
    }
  };

  // Array operations
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }));
    setNewHighlight("");
  };

  const removeHighlight = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx),
    }));
  };

  const addSpecification = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setForm((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey.trim()]: specVal.trim(),
      },
    }));
    setSpecKey("");
    setSpecVal("");
  };

  const removeSpecification = (key: string) => {
    setForm((prev) => {
      const copy = { ...prev.specifications };
      delete copy[key];
      return { ...prev, specifications: copy };
    });
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const categories = ["Lands", "Flats", "Houses"];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      {view === "list" ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-3xl font-black tracking-tight text-gray-900">
              Property Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add, update, or remove property listings, media cards, and category mappings.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-[#de6040] hover:bg-[#de6040]/90 px-6 py-3.5 text-sm font-extrabold text-white shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer uppercase tracking-widest"
          >
            <Plus className="h-4.5 w-4.5" />
            Add New Property
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView("list")}
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-950 cursor-pointer transition-all duration-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-3xl font-black tracking-tight text-gray-900">
              {view === "add" ? "Create New Property" : "Edit Property"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {view === "add"
                ? "Provide visual and specification details to publish a new permanent asset page."
                : "Modify values and save updates to sync changes directly."}
            </p>
          </div>
        </div>
      )}

      {/* Main Panel Content */}
      {view === "list" ? (
        loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#de6040] mb-2" />
            <span className="text-sm text-gray-500">Loading properties library...</span>
          </div>
        ) : error ? (
          <div className="p-20 text-center bg-red-50 rounded-2xl border border-dashed border-red-500/25 text-red-600">
            <span className="text-sm">{error}</span>
          </div>
        ) : properties.length > 0 ? (
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-150 bg-gray-50/50 text-gray-400 text-xs uppercase font-bold tracking-wider">
                    <th className="p-4.5">Property</th>
                    <th className="p-4.5">Category</th>
                    <th className="p-4.5">Locality</th>
                    <th className="p-4.5">Asking Price</th>
                    <th className="p-4.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((property) => {
                    const thumb = property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=80&q=80";
                    return (
                      <tr key={property._id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Thumbnail & Title */}
                        <td className="p-4.5">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={thumb}
                              alt=""
                              className="h-12 w-20 object-cover rounded-lg border border-gray-200 shrink-0 shadow"
                            />
                            <div className="max-w-[200px] truncate">
                              <div className="font-bold text-gray-900 truncate">{property.title}</div>
                              {property.isFeatured && (
                                <span className="inline-block text-[9px] bg-[#de6040]/10 text-[#de6040] px-2 py-0.5 rounded-md font-extrabold mt-1 border border-[#de6040]/20 tracking-wider">
                                  FEATURED
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4.5">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-600">
                            {property.category}
                          </span>
                        </td>

                        {/* Locality */}
                        <td className="p-4.5 text-xs font-semibold text-gray-500 max-w-[150px] truncate" title={property.location}>
                          {property.location}
                        </td>

                        {/* Price */}
                        <td className="p-4.5 font-bold text-gray-900">
                          {formatPrice(property.price)}
                        </td>

                        {/* Actions */}
                        <td className="p-4.5">
                          <div className="flex items-center justify-center gap-2">
                            <a
                              href={`/properties/${property.slug || property._id}`}
                              target="_blank"
                              className="p-2 rounded-xl text-gray-500 hover:text-[#de6040] hover:bg-gray-100 transition-all cursor-pointer"
                              title="View Property Page"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </a>
                            <button
                              onClick={() => handleOpenEdit(property)}
                              className="p-2 rounded-xl text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 transition-all cursor-pointer"
                              title="Edit Listing"
                            >
                              <Edit2 className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(property._id)}
                              className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-20 text-center bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 text-sm">No properties listed. Click "Add New Property" to get started.</p>
          </div>
        )
      ) : (
        /* Form view: add / edit */
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-gray-150 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="The Golden Crest Luxury Villa"
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Price (INR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                placeholder="65000000"
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Locality */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Locality / Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="Jubilee Hills, Hyderabad"
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#de6040] focus:bg-white focus:outline-none cursor-pointer transition-all duration-300"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-gray-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Video URL & Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Walkthrough Video URL (Vertical mp4 recommended) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  value={form.videoUrl}
                  onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://assets.mixkit.co/...mp4"
                  className="flex-grow rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
                />
                <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs font-bold select-none text-gray-700 transition-all duration-300 shadow-sm shrink-0">
                  {uploadingMedia === "video" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#de6040]" />
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload File</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "video")}
                    className="hidden"
                    disabled={!!uploadingMedia}
                  />
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Property Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe details, zonation, layouts, ROI potential..."
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none resize-none transition-all duration-300"
              />
            </div>

            {/* Google Map URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Google Map Iframe Embed URL (optional)
              </label>
              <input
                type="text"
                value={form.googleMapUrl}
                onChange={(e) => setForm((p) => ({ ...p, googleMapUrl: e.target.value }))}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Image URLs & Upload */}
            <div className="md:col-span-2 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Gallery Images
                </label>
                <label className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer text-xs font-bold select-none text-gray-700 transition-all duration-300 shadow-sm">
                  {uploadingMedia === "image" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#de6040]" />
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      <span>Add Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                    disabled={!!uploadingMedia}
                  />
                </label>
              </div>

              {/* Grid of current images */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl border border-gray-200 overflow-hidden shadow group">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Highlights */}
            <div className="md:col-span-2 space-y-3.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Property Highlights / Amenities
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  placeholder="e.g. 24/7 Gated Security"
                  className="flex-grow rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={addHighlight}
                  className="px-5 py-3 rounded-xl bg-white border border-gray-200 text-xs font-bold hover:text-[#de6040] hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
                >
                  Add
                </button>
              </div>

              {/* List */}
              <div className="flex flex-wrap gap-2.5">
                {form.highlights.map((hl, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs rounded-lg bg-gray-100 border border-gray-200 px-3.5 py-1.5 text-gray-700 shadow-sm"
                  >
                    {hl}
                    <button
                      type="button"
                      onClick={() => removeHighlight(idx)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Specifications */}
            <div className="md:col-span-2 space-y-3.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">
                Specifications Table
              </label>
              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Key (e.g. Facing)"
                  className="w-full sm:w-1/3 rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white"
                />
                <input
                  type="text"
                  value={specVal}
                  onChange={(e) => setSpecVal(e.target.value)}
                  placeholder="Value (e.g. East Facing)"
                  className="w-full sm:w-1/3 rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="col-span-2 sm:col-auto px-5 py-3 rounded-xl bg-white border border-gray-200 text-xs font-bold hover:text-[#de6040] hover:bg-gray-50 transition-colors cursor-pointer text-gray-700"
                >
                  Add Spec
                </button>
              </div>

              {/* Specs Table List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {Object.entries(form.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs shadow-sm"
                  >
                    <div>
                      <span className="text-gray-500 font-bold">{key}:</span>{" "}
                      <span className="font-semibold text-gray-900">{val}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-500 hover:text-red-700 ml-3 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-3 md:col-span-2 py-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={form.isFeatured}
                onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
                className="h-4.5 w-4.5 rounded-md border-gray-300 bg-white text-[#de6040] focus:ring-[#de6040]/30 cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-xs font-bold text-gray-600 uppercase cursor-pointer select-none tracking-wider">
                Feature this property on home page
              </label>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                SEO Meta Title (optional)
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm((p) => ({ ...p, metaTitle: e.target.value }))}
                placeholder="Luxury Villa for Sale in Jubilee Hills | Mahesh Verse"
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                SEO Meta Description (optional)
              </label>
              <input
                type="text"
                value={form.metaDescription}
                onChange={(e) => setForm((p) => ({ ...p, metaDescription: e.target.value }))}
                placeholder="Immersive 4 BHK Villa with swimming pool..."
                className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3.5 pt-6 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={() => setView("list")}
              className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-xs font-extrabold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#de6040] hover:bg-[#de6040]/90 text-xs font-extrabold text-white shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer uppercase tracking-widest"
            >
              <Save className="h-4 w-4" />
              Save Property
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
