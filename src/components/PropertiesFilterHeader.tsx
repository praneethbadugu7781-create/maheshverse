"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";

interface FilterHeaderProps {
  initialSearch: string;
  initialCategory: string;
  initialLocation: string;
  initialPriceRange: string;
  locations: string[];
}

export default function PropertiesFilterHeader({
  initialSearch,
  initialCategory,
  initialLocation,
  initialPriceRange,
  locations,
}: FilterHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [priceRange, setPriceRange] = useState(initialPriceRange);

  // Sync state if initial props change
  useEffect(() => {
    setSearch(initialSearch);
    setCategory(initialCategory);
    setLocation(initialLocation);
    setPriceRange(initialPriceRange);
  }, [initialSearch, initialCategory, initialLocation, initialPriceRange]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "all") params.set("category", category);
    if (location && location !== "all") params.set("location", location);
    if (priceRange && priceRange !== "all") params.set("priceRange", priceRange);

    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setPriceRange("all");
    router.push(pathname || "/properties");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  const categoriesList = ["Lands", "Flats", "Houses"];

  return (
    <div className="glass rounded-xl p-5 mb-10 border-border/80 flex flex-col md:flex-row items-center gap-4">
      {/* Search Input */}
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by name, locality, landmarks..."
          className="w-full rounded-lg bg-secondary border border-border/80 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
        {/* Category */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            // Auto apply on dropdown select
            setTimeout(() => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value === "all") params.delete("category");
              else params.set("category", e.target.value);
              router.push(`${pathname}?${params.toString()}`);
            }, 50);
          }}
          className="rounded-lg bg-secondary border border-border/80 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            setTimeout(() => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value === "all") params.delete("location");
              else params.set("location", e.target.value);
              router.push(`${pathname}?${params.toString()}`);
            }, 50);
          }}
          className="rounded-lg bg-secondary border border-border/80 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <select
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value);
            setTimeout(() => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.value === "all") params.delete("priceRange");
              else params.set("priceRange", e.target.value);
              router.push(`${pathname}?${params.toString()}`);
            }, 50);
          }}
          className="rounded-lg bg-secondary border border-border/80 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">Any Budget</option>
          <option value="under-1.5">Under ₹1.5 Cr</option>
          <option value="1.5-3">₹1.5 Cr - ₹3 Cr</option>
          <option value="3-5">₹3 Cr - ₹5 Cr</option>
          <option value="above-5">Above ₹5 Cr</option>
        </select>

        {/* Search & Reset Buttons */}
        <button
          onClick={applyFilters}
          className="col-span-2 md:col-auto px-5 py-2.5 rounded-lg bg-primary text-background font-bold text-sm shadow hover:scale-103 transition-transform cursor-pointer"
        >
          Apply
        </button>

        <button
          onClick={handleReset}
          className="col-span-2 md:col-auto p-2.5 rounded-lg bg-secondary border border-border/80 text-muted-foreground hover:text-foreground transition-all hover:bg-secondary/80 cursor-pointer"
          title="Reset Filters"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
