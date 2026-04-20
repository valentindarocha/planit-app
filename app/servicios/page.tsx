import Link from "next/link";

/* ─────────────────────────────────────────────
   Íconos SVG inline — Lucide, strokeWidth 1.5
───────────────────────────────────────────── */
const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 48,
  height: 48,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconHeadphones() {
  return (
    <svg {...iconProps}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg {...iconProps}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg {...iconProps}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function IconChefHat() {
  return (
    <svg {...iconProps}>
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendarCheck() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Ícono decorativo de fondo — acepta el índice
   para elegir cuál de los 6 renderizar
───────────────────────────────────────────── */
function BgIcon({ index }: { index: number }) {
  const bgProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 56,
    height: 56,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons = [
    // 0 — Headphones
    <svg key="h" {...bgProps}>
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>,
    // 1 — Mic
    <svg key="m" {...bgProps}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>,
    // 2 — Camera
    <svg key="c" {...bgProps}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>,
    // 3 — ChefHat
    <svg key="ch" {...bgProps}>
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
      <line x1="6" y1="17" x2="18" y2="17" />
    </svg>,
    // 4 — MapPin
    <svg key="mp" {...bgProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>,
    // 5 — CalendarCheck
    <svg key="cal" {...bgProps}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>,
  ];

  return icons[index % 6];
}

/* Posiciones fijas de los íconos decorativos:
   top/left en %, rotate en grados.
   Distribuidos orgánicamente, sin grilla. */
const bgIconItems = [
  { i: 0, top:  2, left:  6, rot: -18 },
  { i: 1, top:  4, left: 28, rot:  22 },
  { i: 2, top:  3, left: 52, rot:  -7 },
  { i: 3, top:  5, left: 74, rot:  35 },
  { i: 4, top:  1, left: 91, rot: -25 },
  { i: 5, top: 13, left: 14, rot:  12 },
  { i: 0, top: 16, left: 40, rot: -40 },
  { i: 1, top: 11, left: 63, rot:  18 },
  { i: 2, top: 18, left: 84, rot:  -9 },
  { i: 3, top: 26, left:  3, rot:  28 },
  { i: 4, top: 29, left: 32, rot: -20 },
  { i: 5, top: 24, left: 57, rot:  42 },
  { i: 0, top: 31, left: 78, rot: -33 },
  { i: 1, top: 38, left: 18, rot:  14 },
  { i: 2, top: 40, left: 47, rot: -26 },
  { i: 3, top: 36, left: 90, rot:   6 },
  { i: 4, top: 48, left:  8, rot: -38 },
  { i: 5, top: 51, left: 35, rot:  30 },
  { i: 0, top: 55, left: 62, rot: -14 },
  { i: 1, top: 53, left: 82, rot:  38 },
  { i: 2, top: 62, left: 22, rot: -28 },
  { i: 3, top: 66, left: 50, rot:  20 },
  { i: 4, top: 63, left: 76, rot: -45 },
  { i: 5, top: 74, left:  4, rot:  10 },
  { i: 0, top: 77, left: 38, rot: -17 },
  { i: 1, top: 72, left: 68, rot:  34 },
  { i: 2, top: 79, left: 93, rot: -22 },
  { i: 3, top: 85, left: 15, rot:  26 },
  { i: 4, top: 88, left: 55, rot: -10 },
  { i: 5, top: 91, left: 80, rot:  44 },
  { i: 0, top: 95, left: 30, rot: -32 },
  { i: 1, top: 94, left: 70, rot:  16 },
  // íconos adicionales — total 40
  { i: 2, top:  9, left: 44, rot:  -5 },
  { i: 3, top: 20, left: 96, rot:  27 },
  { i: 4, top: 43, left: 23, rot: -43 },
  { i: 5, top: 58, left: 42, rot:  11 },
  { i: 0, top: 69, left: 88, rot: -36 },
  { i: 1, top: 82, left: 62, rot:  23 },
  { i: 2, top: 97, left:  9, rot: -19 },
  { i: 3, top: 46, left: 71, rot:  39 },
];

function BackgroundIcons() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {bgIconItems.map((item, idx) => (
        <span
          key={idx}
          className="absolute"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `rotate(${item.rot}deg)`,
            color: "#d1d5db",
            opacity: 0.45,
          }}
        >
          <BgIcon index={item.i} />
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Datos de categorías
───────────────────────────────────────────── */
const categorias = [
  {
    label: "DJs",
    slug: "djs",
    icon: <IconHeadphones />,
    descripcion: "Para todo tipo de evento y estilo musical.",
    proveedores: 14,
  },
  {
    label: "Bandas",
    slug: "bandas",
    icon: <IconMic />,
    descripcion: "Grupos en vivo para darle otro nivel a tu evento.",
    proveedores: 9,
  },
  {
    label: "Fotógrafos / Videógrafos",
    slug: "fotografos-videografos",
    icon: <IconCamera />,
    descripcion: "Capturá cada momento con profesionales de la imagen.",
    proveedores: 18,
  },
  {
    label: "Catering / Chefs",
    slug: "catering-chefs",
    icon: <IconChefHat />,
    descripcion: "Gastronomía adaptada al tipo y escala de tu evento.",
    proveedores: 11,
  },
  {
    label: "Lugares",
    slug: "lugares",
    icon: <IconMapPin />,
    descripcion: "Salones, espacios al aire libre y locaciones únicas.",
    proveedores: 22,
  },
  {
    label: "Organizadores de eventos",
    slug: "organizadores",
    icon: <IconCalendarCheck />,
    descripcion: "Coordiná cada detalle con expertos en eventos.",
    proveedores: 7,
  },
];

/* ─────────────────────────────────────────────
   Página
───────────────────────────────────────────── */
export default function ServiciosPage() {
  return (
    <main className="relative flex flex-col flex-1 min-h-screen pt-[50px] bg-white">

      <BackgroundIcons />

      {/* ══════════════════════════════════════
          ENCABEZADO DE SECCIÓN — Propuesta 3
      ══════════════════════════════════════ */}
      <section className="relative z-10 px-8 sm:px-16 lg:px-24 pt-10 pb-8">
        <div className="max-w-5xl">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
          >
            Explorá por categoría
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ¿Qué servicio necesitás?
          </h1>
          <p
            className="text-base sm:text-lg text-gray-500 max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            PLANIT contacta con proveedores de múltiples características para que elijas cuál de ellos se adapta mejor a tu tipo de evento.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GRILLA DE CATEGORÍAS — Propuesta 1
      ══════════════════════════════════════ */}
      <section className="relative z-10 flex-1 px-8 sm:px-16 lg:px-24 pb-16">
        <div className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/servicios/${cat.slug}`}
              className="categoria-card flex flex-col items-center justify-center gap-4 rounded-2xl py-10 px-6 text-center bg-white"
            >
              <span style={{ color: "#E8731A" }}>{cat.icon}</span>
              <span
                className="text-gray-800 text-base font-semibold leading-snug"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {cat.label}
              </span>
              <span
                className="text-gray-400 text-sm leading-snug"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {cat.descripcion}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  fontFamily: "var(--font-poppins)",
                  backgroundColor: "#FFF4EC",
                  color: "#E8731A",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                {cat.proveedores} proveedores disponibles
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA PROVEEDORES — Propuesta 2
      ══════════════════════════════════════ */}
      <section
        className="relative z-10 w-full py-14 px-8 sm:px-16 lg:px-24"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
            >
              ¿Sos proveedor de eventos?
            </h2>
            <p
              className="text-gray-600 text-base leading-relaxed"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Publicá tus servicios, gestioná tu calendario y recibí pagos de señas desde un solo lugar. Llegá a miles de organizadores que buscan exactamente lo que ofrecés.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/cuenta"
              className="cta-button inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-base"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Registrarme como proveedor
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 py-8 text-center text-white text-sm font-medium"
        style={{ backgroundColor: "#E8731A" }}
      >
        © {new Date().getFullYear()} PLANIT — Marketplace de servicios para eventos en Argentina.
      </footer>
    </main>
  );
}
