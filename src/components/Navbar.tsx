"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Building2, ChevronDown, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Do not render navbar on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-white/10 text-white border border-white/10">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">
                Mahesh Verse
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer"
              >
                Categories
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>

              {isDropdownOpen && (
                <div
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-card border border-border p-2 shadow-xl animate-fade-in-up"
                >
                  <Link
                    href="/properties?category=Lands"
                    className="block rounded-lg px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Lands
                  </Link>
                  <Link
                    href="/properties?category=Flats"
                    className="block rounded-lg px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Flats
                  </Link>
                  <Link
                    href="/properties?category=Houses"
                    className="block rounded-lg px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    Houses
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA Button (Pill white) */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-background shadow-lg hover:bg-white/90 transition-all cursor-pointer group"
            >
              Contact us
              <ArrowRight className="h-4 w-4 text-background group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:bg-white/10 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background/95 backdrop-blur-md">
          <div className="space-y-1 px-4 pb-6 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-md py-3 text-base font-semibold text-foreground/90 hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
            <div className="py-2 pl-4 border-l border-border space-y-2">
              <span className="block text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">Categories</span>
              <Link
                href="/properties?category=Lands"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold text-foreground/80 hover:text-foreground"
              >
                Lands
              </Link>
              <Link
                href="/properties?category=Flats"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold text-foreground/80 hover:text-foreground"
              >
                Flats
              </Link>
              <Link
                href="/properties?category=Houses"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold text-foreground/80 hover:text-foreground"
              >
                Houses
              </Link>
            </div>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block rounded-md py-3 text-base font-semibold text-foreground/90 hover:text-foreground"
            >
              Contact
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-base font-bold text-white shadow-lg"
            >
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
