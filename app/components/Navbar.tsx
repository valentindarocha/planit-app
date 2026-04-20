"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Cuenta", href: "/cuenta" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (href: string, scroll?: boolean) => {
    setMenuOpen(false);
    if (scroll) {
      const el = document.getElementById("institucional");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: "#E8731A", height: "50px" }}
    >
      <nav className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-2xl font-extrabold tracking-widest uppercase select-none"
          style={{ letterSpacing: "0.15em" }}
        >
          PLANIT
        </Link>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.scroll ? (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href, true)}
                  className="text-white font-medium text-sm tracking-wide hover:text-orange-100 transition-colors duration-200 cursor-pointer bg-transparent border-none"
                >
                  {link.label}
                </button>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-white font-medium text-sm tracking-wide hover:text-orange-100 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Hamburger button — mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "#D4661A" }}
      >
        <ul className="flex flex-col px-6 py-3">
          {navLinks.map((link) =>
            link.scroll ? (
              <li key={link.label}>
                <button
                  onClick={() => handleNavClick(link.href, true)}
                  className="w-full text-left text-white font-medium text-sm py-3 border-b border-orange-400/40 hover:text-orange-100 transition-colors duration-200 cursor-pointer bg-transparent border-x-0 border-t-0"
                >
                  {link.label}
                </button>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-white font-medium text-sm py-3 border-b border-orange-400/40 hover:text-orange-100 transition-colors duration-200 last:border-b-0"
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </header>
  );
}
