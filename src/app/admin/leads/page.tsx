"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Trash2, AlertCircle, Loader2, Phone, Mail, FileText, CheckCircle } from "lucide-react";
import { formatPrice } from "@/components/PropertyCard";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) {
        throw new Error("Failed to fetch leads.");
      }
      const data = await res.json();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err: any) {
      setError(err.message || "Failed to load leads list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...leads];

    if (statusFilter !== "all") {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (typeFilter !== "all") {
      result = result.filter((l) => l.type === typeFilter);
    }

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(query) ||
          l.phone?.toLowerCase().includes(query) ||
          l.email?.toLowerCase().includes(query) ||
          l.message?.toLowerCase().includes(query)
      );
    }

    setFilteredLeads(result);
  }, [search, statusFilter, typeFilter, leads]);

  // Update lead status
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status.");
      
      // Update local state
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    }
  };

  // Delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete lead.");

      // Remove from local state
      setLeads((prev) => prev.filter((l) => l._id !== leadId));
    } catch (err: any) {
      alert("Error deleting lead: " + err.message);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      alert("No leads to export.");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Enquiry Type", "Property Title", "Message", "Status", "Received Date"];
    const rows = filteredLeads.map((l) => {
      const propTitle = typeof l.propertyId === "object" ? l.propertyId?.title : "General";
      return [
        l.name,
        l.email,
        l.phone,
        l.type,
        propTitle,
        (l.message || "").replace(/"/g, '""'), // Escape quotes
        l.status,
        new Date(l.createdAt).toLocaleDateString(),
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MaheshVerse_Leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-3xl font-black tracking-tight text-gray-900">
            Leads & Enquiries
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor incoming leads, change contact statuses, and export spreadsheet reports.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-[#de6040] hover:bg-[#de6040]/90 px-6 py-3.5 text-sm font-extrabold text-white shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer uppercase tracking-widest"
        >
          <Download className="h-4.5 w-4.5" />
          Export Leads (CSV)
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-gray-150 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="w-full md:flex-grow">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, phone..."
            className="w-full rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#de6040] focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:flex items-center gap-3.5 w-full md:w-auto">
          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-[#de6040] focus:bg-white focus:outline-none cursor-pointer transition-all"
          >
            <option value="all" className="bg-white text-gray-900">All Statuses</option>
            <option value="New" className="bg-white text-gray-900">New</option>
            <option value="Contacted" className="bg-white text-gray-900">Contacted</option>
            <option value="Interested" className="bg-white text-gray-900">Interested</option>
            <option value="Closed" className="bg-white text-gray-900">Closed</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-auto rounded-xl bg-white border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-[#de6040] focus:bg-white focus:outline-none cursor-pointer transition-all"
          >
            <option value="all" className="bg-white text-gray-900">All Channels</option>
            <option value="Enquiry Form" className="bg-white text-gray-900">General Enquiry</option>
            <option value="Request Callback" className="bg-white text-gray-900">Request Callback</option>
            <option value="Schedule Visit" className="bg-white text-gray-900">Schedule Visit</option>
            <option value="Call" className="bg-white text-gray-900">Direct Call</option>
            <option value="WhatsApp" className="bg-white text-gray-900">WhatsApp Chat</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#de6040] mb-2" />
          <span className="text-sm text-gray-500">Loading leads list...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-20 bg-red-50 rounded-2xl border border-dashed border-red-500/25 text-red-600">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span className="text-sm">{error}</span>
          <button onClick={fetchLeads} className="mt-4 text-xs text-[#de6040] hover:underline font-bold">
            Try reloading
          </button>
        </div>
      ) : filteredLeads.length > 0 ? (
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-gray-150 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-150 bg-gray-50/50 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  <th className="p-4.5">Lead Name</th>
                  <th className="p-4.5">Contact Info</th>
                  <th className="p-4.5">Channel</th>
                  <th className="p-4.5">Property</th>
                  <th className="p-4.5">Message</th>
                  <th className="p-4.5">Status</th>
                  <th className="p-4.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => {
                  const propTitle = typeof lead.propertyId === "object" ? lead.propertyId?.title : "General Enquiry";
                  const propId = typeof lead.propertyId === "object" ? lead.propertyId?._id : null;
                  return (
                    <tr key={lead._id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Name & Date */}
                      <td className="p-4.5">
                        <div className="font-bold text-gray-900">{lead.name}</div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {new Date(lead.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="p-4.5 text-xs font-semibold">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone className="h-3.5 w-3.5 text-[#de6040] shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 mt-1.5">
                          <Mail className="h-3.5 w-3.5 text-[#de6040] shrink-0" />
                          <span>{lead.email}</span>
                        </div>
                      </td>

                      {/* Channel */}
                      <td className="p-4.5">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-bold text-gray-600">
                          {lead.type}
                        </span>
                      </td>

                      {/* Property */}
                      <td className="p-4.5 text-xs font-semibold max-w-[150px] truncate" title={propTitle}>
                        {propId ? (
                          <Link href={`/properties/${propId}`} target="_blank" className="text-[#de6040] hover:text-[#ffa61e] transition-colors font-bold">
                            {propTitle}
                          </Link>
                        ) : (
                          <span className="text-gray-400 italic">{propTitle}</span>
                        )}
                      </td>

                      {/* Message */}
                      <td className="p-4.5 text-xs text-gray-600 max-w-[180px] overflow-hidden text-ellipsis whitespace-normal" title={lead.message}>
                        <p className="line-clamp-2">{lead.message || "No message provided."}</p>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4.5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none cursor-pointer transition-colors ${
                            lead.status === "New"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : lead.status === "Contacted"
                              ? "bg-cyan-50 text-cyan-600 border-cyan-100"
                              : lead.status === "Interested"
                              ? "bg-purple-50 text-purple-600 border-purple-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                        >
                          <option value="New" className="bg-white text-gray-900">New</option>
                          <option value="Contacted" className="bg-white text-gray-900">Contacted</option>
                          <option value="Interested" className="bg-white text-gray-900">Interested</option>
                          <option value="Closed" className="bg-white text-gray-900">Closed</option>
                        </select>
                      </td>

                      {/* Delete Action */}
                      <td className="p-4.5 text-center">
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="p-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-white/50 backdrop-blur-md rounded-2xl border border-dashed border-gray-200 text-center">
          <FileText className="h-8 w-8 text-gray-400 mb-3" />
          <h3 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-sm font-extrabold text-gray-900">No matching leads</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            We couldn't find any leads matching your search constraints. Try resetting search parameters.
          </p>
        </div>
      )}
    </div>
  );
}
