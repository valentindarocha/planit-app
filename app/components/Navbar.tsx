"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

/* ─────────────────────────────────────────────
   Links estáticos (siempre visibles)
───────────────────────────────────────────── */
const staticLinks = [
  { label: "Inicio",    href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Nosotros",  href: "/nosotros" },
];

/* ─────────────────────────────────────────────
   Mini avatar circular (32 px)
───────────────────────────────────────────── */
function NavAvatar({ url, nombre }: { url: string | null; nombre: string }) {
  const inicial = nombre.trim()[0]?.toUpperCase() ?? "U";

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={nombre}
        width={32}
        height={32}
        className="rounded-full object-cover border-2 border-white/60 flex-shrink-0"
        style={{ width: 32, height: 32 }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 border-white/60"
      style={{
        width: 32,
        height: 32,
        backgroundColor: "#FFF0E6",
        color: "#E8731A",
      }}
    >
      {inicial}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Navbar
───────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, tipoCuenta, loading, avatarUrl, signOut } = useAuth();

  const nombreDisplay = user?.email ?? "";
  /* Ruta del panel según tipo de cuenta */
  const panelHref = tipoCuenta === "proveedor" ? "/panel-proveedor" : "/panel-organizador";

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

        {/* ── Desktop menu ── */}
        <ul className="hidden md:flex items-center gap-8">
          {staticLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-white font-medium text-sm tracking-wide hover:text-orange-100 transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Área de cuenta — esqueleto mientras carga */}
          {loading ? (
            <li>
              <div className="w-14 h-4 rounded bg-white/30 animate-pulse" />
            </li>
          ) : user ? (
            /* Usuario logueado: avatar + Mi Panel + Cerrar sesión */
            <>
              <li>
                <Link
                  href={panelHref}
                  className="flex items-center gap-2 text-white font-semibold text-sm tracking-wide hover:text-orange-100 transition-colors duration-200"
                >
                  <NavAvatar url={avatarUrl} nombre={nombreDisplay} />
                  Mi Panel
                </Link>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="text-white font-medium text-sm tracking-wide hover:text-orange-100 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            /* No logueado: Cuenta */
            <li>
              <Link
                href="/cuenta"
                className="text-white font-medium text-sm tracking-wide hover:text-orange-100 transition-colors duration-200"
              >
                Cuenta
              </Link>
            </li>
          )}
        </ul>

        {/* ── Hamburguesa mobile ── */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* ── Dropdown mobile ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ backgroundColor: "#D4661A" }}
      >
        <ul className="flex flex-col px-6 py-3">
          {staticLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block text-white font-medium text-sm py-3 border-b border-orange-400/40 hover:text-orange-100 transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Área de cuenta mobile */}
          {!loading && (
            user ? (
              <>
                <li>
                  <Link
                    href={panelHref}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-white font-semibold text-sm py-3 border-b border-orange-400/40 hover:text-orange-100 transition-colors duration-200"
                  >
                    <NavAvatar url={avatarUrl} nombre={nombreDisplay} />
                    Mi Panel
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full text-left text-white font-medium text-sm py-3 hover:text-orange-100 transition-colors duration-200 bg-transparent border-none cursor-pointer"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/cuenta"
                  onClick={() => setMenuOpen(false)}
                  className="block text-white font-medium text-sm py-3 hover:text-orange-100 transition-colors duration-200"
                >
                  Cuenta
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </header>
  );
}
