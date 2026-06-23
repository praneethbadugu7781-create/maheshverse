import Link from "next/link";
import { MapPin, BedDouble, Square, ArrowRight } from "lucide-react";

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    slug: string;
    price: number;
    location: string;
    category: string;
    images: string[];
    specifications?: Record<string, string>;
  };
}

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const thumbnail = property.images?.[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  // Try to find configuration and area from specifications map
  const config = property.specifications?.["Configuration"] || property.specifications?.["Plot Area"] || "";
  const area = property.specifications?.["Super Area"] || property.specifications?.["Built-up Area"] || property.specifications?.["Total Area"] || "";

  return (
    <div className="group flex flex-col rounded-xl overflow-hidden bg-card border border-border/60 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-md">
      {/* Image Gallery Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={property.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm border border-white/5">
          {property.category}
        </span>
        {/* Price Tag */}
        <span className="absolute bottom-3 right-3 rounded-md bg-gradient-to-r from-primary to-amber-500 px-3 py-1.5 text-sm font-bold text-background shadow-lg">
          {formatPrice(property.price)}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
        </div>

        {/* Spec Badges */}
        <div className="flex gap-4 border-t border-b border-border/40 py-3 my-4">
          {config && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <BedDouble className="h-4 w-4 text-primary/70" />
              <span>{config}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Square className="h-4 w-4 text-primary/70" />
              <span>{area}</span>
            </div>
          )}
          {!config && !area && (
            <span className="text-xs text-muted-foreground italic">Contact for configurations</span>
          )}
        </div>

        {/* View Details Link */}
        <Link
          href={`/properties/${property.slug || property._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-sm font-semibold hover:bg-primary hover:text-background transition-all duration-300"
        >
          View Details
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
