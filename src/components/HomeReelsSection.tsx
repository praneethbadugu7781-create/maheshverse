"use client";

import { useState } from "react";
import ReelPlayer from "./ReelPlayer";
import LeadForm from "./LeadForm";
import { X } from "lucide-react";

interface HomeReelsSectionProps {
  properties: any[];
}

export default function HomeReelsSection({ properties }: HomeReelsSectionProps) {
  // Modal states for direct enquiry within the video player
  const [activeProperty, setActiveProperty] = useState<{ id: string; name: string } | null>(null);

  const handleEnquireClick = (id: string, name: string) => {
    setActiveProperty({ id, name });
  };

  const closeModal = () => {
    setActiveProperty(null);
  };

  // Filter properties that have video URLs
  const videoProperties = properties.filter((p) => p.videoUrl);

  if (videoProperties.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl bg-card border border-border">
        <p className="text-muted-foreground text-sm">No property videos uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scrollable Reels Deck */}
      <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar justify-start md:justify-center px-4">
        {videoProperties.map((property) => (
          <div key={property._id} className="snap-center shrink-0 w-full sm:w-auto">
            <ReelPlayer property={property} onEnquireClick={handleEnquireClick} />
          </div>
        ))}
      </div>

      {/* Slide-over Enquiry Modal overlay */}
      {activeProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="relative w-full max-w-md bg-card rounded-2xl overflow-hidden border border-border shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/60 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Lead Form wrapper */}
            <div className="p-2">
              <LeadForm
                propertyId={activeProperty.id}
                propertyName={activeProperty.name}
                defaultType="WhatsApp"
                onSuccess={() => {
                  // Keep it open for 3 seconds to let them see success then close
                  setTimeout(closeModal, 3000);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
