import { dataService } from "@/lib/dataService";
import { formatPrice } from "@/components/PropertyCard";
import { Building, Users, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Disable cache for dashboard overview

export default async function AdminOverviewPage() {
  const properties = await dataService.getProperties();
  const leads = await dataService.getLeads();

  // Stats calculation
  const totalProperties = properties.length;
  const totalLeads = leads.length;
  const newLeads = leads.filter((l: any) => l.status === "New").length;
  const closedLeads = leads.filter((l: any) => l.status === "Closed").length;

  const recentLeads = leads.slice(0, 5);

  const statCards = [
    { name: "Total Properties", value: totalProperties, icon: Building, color: "text-[#de6040] bg-[#de6040]/5 border-[#de6040]/10", glow: "" },
    { name: "Total Enquiries", value: totalLeads, icon: Users, color: "text-cyan-600 bg-cyan-50 border-cyan-100", glow: "" },
    { name: "New Enquiries", value: newLeads, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100", glow: "" },
    { name: "Closed Deals", value: closedLeads, icon: CheckCircle2, color: "text-[#25d366] bg-emerald-50 border-emerald-100", glow: "" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-3xl font-black tracking-tight text-gray-900">
          Overview Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, Admin. Here is the latest performance summary for Mahesh Verse.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="relative group overflow-hidden bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-gray-150 shadow-sm hover:border-[#de6040]/30 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3.5 rounded-xl ${card.color} border shrink-0`}>
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <div>
                  <span style={{ fontFamily: 'Urbanist, sans-serif' }} className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {card.name}
                  </span>
                  <span style={{ fontFamily: 'Urbanist, sans-serif' }} className="block text-2xl font-black mt-0.5 text-gray-900">
                    {card.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries (2 cols) */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-gray-150 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-lg font-extrabold tracking-wide text-gray-900">
              Recent Enquiries
            </h2>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#de6040] hover:text-[#ffa61e] transition-colors"
            >
              <span style={{ fontFamily: 'Urbanist, sans-serif' }} className="tracking-wider">MANAGE ALL LEADS</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 text-xs uppercase font-bold tracking-wider">
                  <th className="pb-3.5">Name</th>
                  <th className="pb-3.5">Contact</th>
                  <th className="pb-3.5">Type</th>
                  <th className="pb-3.5">Property</th>
                  <th className="pb-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead: any) => {
                    const propTitle = typeof lead.propertyId === "object" ? lead.propertyId?.title : "General";
                    return (
                      <tr key={lead._id} className="group hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 font-semibold text-gray-900">{lead.name}</td>
                        <td className="py-4 text-xs text-gray-600">
                          <div className="font-semibold">{lead.phone}</div>
                          <div className="opacity-70 mt-0.5">{lead.email}</div>
                        </td>
                        <td className="py-4 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-gray-600 font-semibold">
                            {lead.type}
                          </span>
                        </td>
                        <td className="py-4 text-xs font-semibold text-[#de6040] max-w-[150px] truncate hover:underline" title={propTitle}>
                          {propTitle}
                        </td>
                        <td className="py-4">
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                            lead.status === "New"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : lead.status === "Contacted"
                              ? "bg-cyan-50 text-cyan-600 border border-cyan-100"
                              : lead.status === "Interested"
                              ? "bg-purple-50 text-purple-600 border border-purple-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                      No leads received yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Info Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-gray-150 shadow-sm space-y-6">
            <h2 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-lg font-extrabold tracking-wide text-gray-900">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-3.5">
              <Link
                href="/admin/properties?action=add"
                className="flex items-center justify-center rounded-xl bg-[#de6040] hover:bg-[#de6040]/90 py-3.5 text-sm font-extrabold text-white shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest cursor-pointer"
              >
                Add New Property
              </Link>
              <Link
                href="/admin/leads"
                className="flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 py-3.5 text-sm font-bold text-gray-700 transition-all duration-300 uppercase tracking-widest cursor-pointer"
              >
                Verify Active Leads
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-center rounded-xl bg-white border border-gray-200 hover:bg-gray-50 py-3.5 text-sm font-bold text-gray-700 transition-all duration-300 uppercase tracking-widest cursor-pointer"
              >
                View Main Site
              </Link>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-gray-150 shadow-sm space-y-4">
            <h3 style={{ fontFamily: 'Urbanist, sans-serif' }} className="text-xs font-bold uppercase text-gray-400 tracking-widest">
              Property Metrics
            </h3>
            <div className="space-y-3.5 pt-1">
              {[
                { label: "Houses Count", count: properties.filter((p: any) => p.category === "Houses").length, color: "bg-[#de6040]" },
                { label: "Flats Count", count: properties.filter((p: any) => p.category === "Flats").length, color: "bg-cyan-500" },
                { label: "Lands Count", count: properties.filter((p: any) => p.category === "Lands").length, color: "bg-emerald-500" },
              ].map((metric) => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-semibold">{metric.label}</span>
                    <span className="font-extrabold text-gray-900">{metric.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} rounded-full`}
                      style={{ width: `${totalProperties > 0 ? (metric.count / totalProperties) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
