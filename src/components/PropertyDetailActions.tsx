"use client";

import { useState } from "react";
import { Phone, MessageSquare, Calendar, PhoneCall, X } from "lucide-react";
import LeadForm from "./LeadForm";

interface PropertyActionsProps {
  propertyId: string;
  propertyName: string;
}

export default function PropertyDetailActions({ propertyId, propertyName }: PropertyActionsProps) {
  const [activeModalType, setActiveModalType] = useState<
    "Call" | "WhatsApp" | "Schedule Visit" | "Request Callback" | null
  >(null);

  // Registers lead in the backend before routing/acting
  const handleDirectContact = async (type: "Call" | "WhatsApp") => {
    try {
      // Send lead to backend in background
      await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Anonymous Visitor",
          email: "no-email@visitor.com",
          phone: "9999999999",
          message: `Visitor initiated a ${type} contact directly from detail page of ${propertyName}.`,
          type,
          propertyId,
        }),
      });
    } catch (e) {
      console.error("Failed to log direct contact lead:", e);
    }

    // Trigger behavior
    if (type === "WhatsApp") {
      const waText = encodeURIComponent(
        `Hi Mahesh, I just viewed your video reel of "${propertyName}" on Mahesh Verse and would like to get more details and pricing.`
      );
      window.open(`https://wa.me/919999999999?text=${waText}`, "_blank");
    } else if (type === "Call") {
      window.open("tel:+919999999999");
    }
  };

  const handleOpenModal = (type: "Schedule Visit" | "Request Callback") => {
    setActiveModalType(type);
  };

  const closeModal = () => {
    setActiveModalType(null);
  };

  return (
    <div className="space-y-4">
      {/* Primary Action Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* WhatsApp Button */}
        <button
          onClick={() => handleDirectContact("WhatsApp")}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-sm font-extrabold shadow-md cursor-pointer transition-all hover:scale-[1.02]"
        >
          <MessageSquare className="h-4 w-4" />
          WhatsApp Inquiry
        </button>

        {/* Call Now Button */}
        <button
          onClick={() => handleDirectContact("Call")}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3.5 text-sm font-extrabold shadow-md cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Phone className="h-4 w-4" />
          Call Now
        </button>
      </div>

      {/* Secondary CTAs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Schedule Visit */}
        <button
          onClick={() => handleOpenModal("Schedule Visit")}
          className="flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border/80 text-foreground py-3 text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Calendar className="h-4 w-4 text-primary" />
          Schedule Visit
        </button>

        {/* Request Callback */}
        <button
          onClick={() => handleOpenModal("Request Callback")}
          className="flex items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border/80 text-foreground py-3 text-xs font-bold cursor-pointer transition-all hover:scale-[1.02]"
        >
          <PhoneCall className="h-4 w-4 text-primary" />
          Request Callback
        </button>
      </div>

      {/* Slide-over Enquiry Modal overlay */}
      {activeModalType && (
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
                propertyId={propertyId}
                propertyName={propertyName}
                defaultType={activeModalType}
                onSuccess={() => {
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
