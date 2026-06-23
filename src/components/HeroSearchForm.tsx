"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function HeroSearchForm() {
  const [activeTab, setActiveTab] = useState<"Buy" | "Rent" | "Sell">("Buy");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [propertyType, setPropertyType] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in Name and Email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: "0000000000", // Default phone for simple hero form
          message: `Visitor submitted Hero Search form. Action: ${activeTab}. Property Type: ${propertyType || "Any"}.`,
          type: "Enquiry Form",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-4xl mx-auto -mt-16 bg-white text-black p-8 rounded-2xl shadow-2xl relative z-10 border border-black/5 flex items-center justify-center gap-3 animate-fade-in-up">
        <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-lg">Thank you!</h4>
          <p className="text-sm text-gray-500">Your property search request has been submitted to Mahesh.</p>
        </div>
      </div>
    );
  }

  const tabOptions: ("Buy" | "Rent" | "Sell")[] = ["Buy", "Rent", "Sell"];

  return (
    <div className="w-full max-w-4xl mx-auto -mt-20 relative z-20 px-4">
      {/* Search Card Container */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-black/5">
        
        {/* Tabs Row */}
        <div className="flex bg-gray-100 border-b border-gray-200">
          {tabOptions.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setError("");
                }}
                className={`px-8 py-3.5 text-sm font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-black rounded-t-xl"
                    : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Inputs Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
          {error && (
            <div className="text-xs text-red-500 bg-red-50 p-2.5 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            
            {/* Name Input */}
            <div className="flex-grow">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            {/* Email Input */}
            <div className="flex-grow">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@framer.com"
                className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-black placeholder-gray-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>

            {/* Property Type Dropdown */}
            <div className="flex-grow">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent border-b border-gray-300 py-3 text-sm text-black focus:border-black focus:outline-none cursor-pointer"
              >
                <option value="">Property Type</option>
                <option value="Lands">Lands</option>
                <option value="Flats">Flats</option>
                <option value="Houses">Houses</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:shrink-0 pt-3 md:pt-0">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-black/90 px-8 py-3 text-sm font-bold text-white shadow transition-all cursor-pointer group"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    Submit
                    <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
