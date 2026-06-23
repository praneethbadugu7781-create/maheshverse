"use client";

import { useEffect, useState } from "react";
import AdminLogin from "@/components/AdminLogin";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check auth session
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setIsAuthenticated(!!data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      router.push("/admin");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-gray-900">
        <div className="flex flex-col items-center gap-3 text-gray-500 text-sm font-medium">
          <Loader2 className="h-8 w-8 animate-spin text-[#de6040]" />
          <span style={{ fontFamily: 'Urbanist, sans-serif' }} className="tracking-wide">Verifying secure session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const menuItems = [
    { name: "Overview", href: "/admin" },
    { name: "Properties", href: "/admin/properties" },
    { name: "Leads & Enquiries", href: "/admin/leads" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-900 font-sans antialiased relative overflow-x-hidden">
      {/* Main Header Navbar */}
      <header className="w-full max-w-6xl mx-auto px-6 h-24 flex items-center justify-between z-30 relative">
        {/* Brand Logo matching Main Site */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/images/mahesh-verse-logo-dark.svg"
            alt="Mahesh Verse Logo"
            className="h-6 w-auto group-hover:opacity-90 transition-opacity duration-300"
          />
        </Link>

        {/* Desktop Navbar Menu */}
        <nav className="hidden md:flex items-center gap-8 bg-gray-100 border border-gray-200 rounded-full px-7 py-3 shadow-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[14px] font-bold tracking-wide transition-colors ${
                  isActive ? "text-[#de6040]" : "text-gray-600 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link href="/" target="_blank" className="text-[14px] font-bold tracking-wide text-gray-600 hover:text-black">
            View Website
          </Link>
        </nav>

        {/* Desktop Log Out Button */}
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className="bg-black hover:bg-black/90 text-white hover:scale-[1.02] active:scale-[0.98] transition-all rounded-full px-6 py-3 text-xs font-black tracking-widest uppercase cursor-pointer"
          >
            Log Out
          </button>
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2.5 rounded-full bg-gray-100 border border-gray-200 text-gray-800 hover:text-black cursor-pointer transition-colors"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-6 right-6 z-40 bg-white border border-gray-200 rounded-2xl p-6 shadow-xl flex flex-col gap-4 animate-fade-in-up">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-[15px] font-bold tracking-wide py-2 ${
                  isActive ? "text-[#de6040]" : "text-gray-700 hover:text-black"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[15px] font-bold tracking-wide text-gray-700 hover:text-black py-2"
          >
            View Website
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
            className="mt-2 w-full bg-black text-white text-center py-3 rounded-full text-xs font-black tracking-widest uppercase cursor-pointer"
          >
            Log Out
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-6xl mx-auto px-6 pt-4 pb-12 relative z-10 flex-grow flex flex-col justify-start">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-md text-gray-900">
          {children}
        </div>
      </main>

      {/* Footer matching Main Site */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-10 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <img src="/images/mahesh-verse-logo-dark.svg" alt="Mahesh Verse Logo" className="h-5.5 w-auto opacity-60" />
        </div>
        <p className="text-[11px] text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} Mahesh Verse. All rights reserved. Admin secure control panel.
        </p>
      </footer>
    </div>
  );
}
