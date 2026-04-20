import Link from "next/link";

/* ─────────────────────────────────────────────
   Íconos SVG inline — Lucide, strokeWidth 1.5
───────────────────────────────────────────── */
const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 36,
  height: 36,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconEye() {
  return (
    <svg {...iconProps}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg {...iconProps}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg {...iconProps}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconBadgeCheck() {
  return (
    <svg {...iconProps}>
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Datos
───────────────────────────────────────────── */
const timelineItems = [
  {
    etapa: "2024",
    titulo: "La idea",
    descripcion:
      "Desarrollar una plataforma en dónde los proveedores de servicios para eventos puedan gestionar sus calendarios y a la vez poder captar nuevos clientes. Y para los individuales organizadores, tener un lugar donde comparar, buscar y elegir el mejor proveedor para su evento.",
    actual: false,
  },
  {
    etapa: "2025",
    titulo: "Desarrollo",
    descripcion:
      "Construimos las primeras versiones de PLANIT. Definimos la plataforma, el modelo de negocio.",
    actual: false,
  },
  {
    etapa: "2026",
    titulo: "Lanzamiento",
    descripcion:
      "PLANIT abre sus puertas al público. Organizadores y proveedores pueden registrarse, publicar servicios, reservar fechas y gestionar pagos de señas de forma segura desde un solo lugar.",
    actual: true,
  },
  {
    etapa: "Futuro cercano",
    titulo: "Expansión nacional",
    descripcion:
      "Crecimiento hacia todas las provincias de Argentina. Más categorías de servicios, herramientas avanzadas para proveedores y funcionalidades de comparación inteligente para organizadores.",
    actual: false,
  },
  {
    etapa: "Visión",
    titulo: "Latinoamérica",
    descripcion:
      "Ser la plataforma de referencia regional para la organización de eventos. Transformar una industria que mueve miles de millones de pesos al año y que todavía opera de forma informal y fragmentada.",
    actual: false,
  },
];

const pilares = [
  {
    icon: <IconEye />,
    titulo: "Transparencia",
    descripcion: "Precios visibles y reales desde el primer momento. Sin llamadas, sin sorpresas.",
  },
  {
    icon: <IconShield />,
    titulo: "Seguridad",
    descripcion: "Los pagos de señas están respaldados por la plataforma. Tu dinero, protegido.",
  },
  {
    icon: <IconZap />,
    titulo: "Simplicidad",
    descripcion: "Todo en un solo lugar: buscá, comparé, reservá y pagá sin salir de PLANIT.",
  },
  {
    icon: <IconBadgeCheck />,
    titulo: "Confianza",
    descripcion: "Proveedores verificados, con perfiles completos, reseñas y disponibilidad en tiempo real.",
  },
];

/* ─────────────────────────────────────────────
   Página
───────────────────────────────────────────── */
export default function NosotrosPage() {
  return (
    <main className="flex flex-col flex-1 min-h-screen pt-[50px] bg-white">

      {/* ══════════════════════════════════════
          SECCIÓN 1 — Pilares de PLANIT
      ══════════════════════════════════════ */}
      <section
        className="w-full pt-10 pb-16 sm:pt-12 sm:pb-20 px-6 sm:px-10 lg:px-20"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
            >
              Nuestros valores
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-800"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              En qué creemos
            </h2>
          </div>

          {/* Grid de pilares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {pilares.map((pilar) => (
              <div
                key={pilar.titulo}
                className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
              >
                <span style={{ color: "#E8731A" }}>{pilar.icon}</span>
                <h3
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {pilar.titulo}
                </h3>
                <p
                  className="text-sm sm:text-base text-gray-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {pilar.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECCIÓN 2 — Timeline
      ══════════════════════════════════════ */}
      <section className="w-full max-w-2xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-10"
          style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
        >
          Nuestra historia
        </h2>

        <div className="relative">
          {/* Línea vertical */}
          <div
            className="absolute top-0 bottom-0 left-[7px] w-[2px]"
            style={{ backgroundColor: "#E8731A", opacity: 0.25 }}
          />

          <ol className="flex flex-col gap-10">
            {timelineItems.map((item) => (
              <li key={item.etapa} className="relative pl-10">
                {/* Nodo */}
                <span
                  className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    backgroundColor: item.actual ? "#E8731A" : "#ffffff",
                    borderColor: "#E8731A",
                    boxShadow: item.actual ? "0 0 0 4px rgba(232,115,26,0.15)" : "none",
                  }}
                />
                {/* Etiqueta */}
                <span
                  className="inline-block text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
                >
                  {item.etapa}
                  {item.actual && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded-full text-white text-[10px] font-bold tracking-wide"
                      style={{ backgroundColor: "#E8731A" }}
                    >
                      Ahora
                    </span>
                  )}
                </span>
                {/* Título */}
                <h3
                  className="text-lg sm:text-xl font-bold text-gray-800 mb-2"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {item.titulo}
                </h3>
                {/* Descripción */}
                <p
                  className="text-sm sm:text-base leading-relaxed text-gray-600"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {item.descripcion}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SECCIÓN 3 — CTA final
      ══════════════════════════════════════ */}
      <section className="w-full py-16 sm:py-20 px-6 text-center bg-white">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-bold mb-4"
            style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
          >
            ¿Listo para organizar tu próximo evento?
          </h2>
          <p
            className="text-gray-600 text-base mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Explorá los servicios disponibles o creá tu cuenta para empezar a organizar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/servicios"
              className="cta-button inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-base"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Ver servicios <span>→</span>
            </Link>
            <Link
              href="/cuenta"
              className="cta-outline inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold text-base"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Registrarme
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-8 text-center text-white text-sm font-medium"
        style={{ backgroundColor: "#E8731A", fontFamily: "var(--font-poppins)" }}
      >
        © {new Date().getFullYear()} PLANIT — Marketplace de servicios para eventos en Argentina.
      </footer>

    </main>
  );
}
