import Link from "next/link";

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Página 404
───────────────────────────────────────────── */
export default function NotFound() {
  return (
    <main
      className="min-h-screen pt-[50px] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "var(--font-poppins)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        {/* Número 404 grande con estilo PLANIT */}
        <div className="flex items-baseline justify-center gap-1 mb-6">
          <span
            className="text-7xl font-extrabold leading-none"
            style={{ color: "#E8731A", letterSpacing: "-0.05em" }}
          >
            4
          </span>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
          >
            <IconSearch />
          </div>
          <span
            className="text-7xl font-extrabold leading-none"
            style={{ color: "#E8731A", letterSpacing: "-0.05em" }}
          >
            4
          </span>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Esta página no existe
        </h1>

        {/* Descripción */}
        <p className="text-sm text-gray-500 leading-relaxed mb-7 max-w-xs mx-auto">
          La dirección que ingresaste no corresponde a ninguna página de PLANIT.
          Puede que el link esté mal escrito o que el contenido ya no esté disponible.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <IconHome />
            Volver al inicio
          </Link>

          <Link
            href="/servicios"
            className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-colors flex items-center justify-center gap-2 hover:bg-orange-50"
            style={{ borderColor: "#E8731A", color: "#E8731A" }}
          >
            <IconGrid />
            Explorar servicios
          </Link>
        </div>

        {/* Marca PLANIT abajo */}
        <p
          className="text-[10px] uppercase tracking-widest text-gray-400 mt-7 font-semibold"
          style={{ letterSpacing: "0.15em" }}
        >
          PLANIT — Marketplace de servicios para eventos
        </p>
      </div>
    </main>
  );
}
