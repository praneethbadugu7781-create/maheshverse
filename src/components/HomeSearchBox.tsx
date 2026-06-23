"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeSearchBox() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (location !== "all") params.set("location", location);

    const query = params.toString();
    router.push(`/properties${query ? `?${query}` : ""}`);
  };

  const categoriesList = ["Lands", "Flats", "Houses"];

  return (
    <form
      onSubmit={handleSearch}
      className="glass rounded-xl p-5 border-border/80 flex flex-col md:flex-row items-center gap-4 w-full"
    >
      {/* Text input */}
      <div className="relative w-full md:flex-grow">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by keywords, landmarks, or builder name..."
          className="w-full rounded-lg bg-secondary border border-border/80 pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Selects */}
      <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg bg-secondary border border-border/80 px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">Any Category</option>
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg bg-secondary border border-border/80 px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">Any Location</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Ananthagiri">Ananthagiri</option>
        </select>

        <button
          type="submit"
          className="col-span-2 md:col-auto px-6 py-3 rounded-lg bg-primary hover:bg-primary-foreground hover:text-primary text-white font-bold text-sm shadow hover:scale-[1.02] transition-transform cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
}
