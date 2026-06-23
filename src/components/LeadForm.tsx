"use client";

import { useState } from "react";
import { User, Mail, Phone, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";

interface LeadFormProps {
  propertyId?: string;
  propertyName?: string;
  defaultType?: "Call" | "WhatsApp" | "Schedule Visit" | "Request Callback" | "Enquiry Form";
  onSuccess?: () => void;
}

export default function LeadForm({
  propertyId,
  propertyName,
  defaultType = "Enquiry Form",
  onSuccess,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: propertyName ? `Hi, I am interested in ${propertyName}. Please share more details.` : "",
    type: defaultType,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 glass rounded-xl border-primary/20 animate-fade-in-up">
        <div className="p-3 rounded-full bg-accent/20 text-accent mb-4 border border-accent/20">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Enquiry Submitted!</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Thank you for reaching out. Mahesh will contact you shortly regarding this request.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border-border/80 relative overflow-hidden">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-amber-500" />
      
      <h3 className="text-lg font-bold mb-4">
        {propertyName ? `Enquire about ${propertyName}` : "Request Property Details"}
      </h3>

      {error && (
        <div className="mb-4 text-xs bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Type selector */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Enquiry Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-lg bg-secondary border border-border/80 px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="Enquiry Form">General Enquiry</option>
            <option value="Request Callback">Request Callback</option>
            <option value="Schedule Visit">Schedule Site Visit</option>
            <option value="Call Now">Call Enquiry</option>
            <option value="WhatsApp">WhatsApp Inquiry</option>
          </select>
        </div>

        {/* Name input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-lg bg-secondary border border-border/80 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Email input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full rounded-lg bg-secondary border border-border/80 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Phone input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg bg-secondary border border-border/80 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Message input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Your Message
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="I'd like to check this property..."
              className="w-full rounded-lg bg-secondary border border-border/80 pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-amber-500 py-3 text-sm font-bold text-background shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
