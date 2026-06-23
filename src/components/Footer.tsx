"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Mail, MapPin, Phone, HelpCircle } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Do not render footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
                MAHESH VERSE
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Converting real estate reels into permanent, searchable, lead-generating assets. Watch property videos, explore opportunities, and connect instantly.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/25 hover:text-primary transition-all duration-300 flex items-center justify-center"
              >
                <svg className="h-4 w-4 fill-current hover:text-primary" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/25 hover:text-primary transition-all duration-300 flex items-center justify-center"
              >
                <svg className="h-4 w-4 fill-current hover:text-primary" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary hover:bg-primary/25 hover:text-primary transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  About Mahesh
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-all">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/properties?category=Lands"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  Lands
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?category=Flats"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  Flats
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?category=Houses"
                  className="text-sm text-muted-foreground hover:text-foreground transition-all"
                >
                  Houses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>info@maheshverse.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Jubilee Hills, Hyderabad, Telangana, 500033</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Mahesh Verse. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary transition-all flex items-center gap-1">
              <HelpCircle className="h-3 w-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
