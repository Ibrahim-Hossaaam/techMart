"use client";

import Link from "next/link";
import { Zap, Mail, Phone, MapPin, X,  } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-card mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg gradient-primary">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
                <span className="text-gradient">Nexa</span>
                <span className="text-foreground">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your ultimate destination for premium tech products. Quality guaranteed, prices unbeatable.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[
                { Icon: X, href: "#" },
                
                
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "Brands", href: "/brands" },
                { label: "Cart", href: "/cart" },
                { label: "My Orders", href: "/orders" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              {[
                "Help Center",
                "Return Policy",
                "Shipping Info",
                "Track Order",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                support@nexashop.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                123 Tech Street, Silicon Valley, CA 94025
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} NexaShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
