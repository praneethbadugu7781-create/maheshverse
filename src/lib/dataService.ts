import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export const dataService = {
  // PROPERTIES
  getProperties: async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/properties`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch properties");
      return await res.json();
    } catch (error) {
      console.error("Error in getProperties:", error);
      return [];
    }
  },

  getPropertyById: async (idOrSlug: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/properties/${idOrSlug}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error(`Error in getPropertyById (${idOrSlug}):`, error);
      return null;
    }
  },

  // LEADS
  getLeads: async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
      
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        headers: {
          Cookie: token ? `token=${token}` : "",
        },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch leads");
      return await res.json();
    } catch (error) {
      console.error("Error in getLeads:", error);
      return [];
    }
  },
};
