import Link from "next/link";

const institucionalBlocks = [
  {
    title: "¿Qué es PLANIT?",
    body: "PLANIT es una plataforma de reservas y pagos para servicios de eventos. Un solo lugar donde podés ver precios, comparar disponibilidad, reservar fechas y pagar señas de forma segura.",
    icon: "🎯",
  },
  {
    title: "Nuestra Misión",
    body: "Conectar organizadores y proveedores de eventos de forma simple, transparente y confiable. Queremos ser otro foco de trabajo para los proveedores y la primera opción para los organizadores.",
    icon: "🤝",
  },
  {
    title: "Nuestra Visión",
    body: "Ser la plataforma de referencia nacional para la organización de eventos en Argentina, y escalar regionalmente en Latinoamérica.",
    icon: "🌎",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      {/* ─────────────────────────────────────────────
          SECCIÓN HERO
      ───────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center min-h-screen pt-[50px]">
        {/* Imagen 100% ancho, sin márgenes */}
        <div className="absolute inset-0 pt-[50px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=80&auto=format&fit=crop"
            alt="Salón de eventos con iluminación cálida y suave"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay oscuro semi-transparente para contraste */}
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Texto y CTA centrados verticalmente */}
        <div className="relative z-10 w-full px-4 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight tracking-wide drop-shadow-lg mb-10"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            TU EVENTO EN UN SOLO LUGAR
          </h1>

          <Link
            href="/servicios"
            className="cta-button inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-base sm:text-lg tracking-wide shadow-lg"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Organizá tu evento ahora
            <span className="text-xl leading-none">→</span>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECCIÓN TABLA COMPARATIVA
      ───────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6 sm:px-10 lg:px-20">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-10">
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "#E8731A", fontFamily: "var(--font-poppins)" }}
            >
              ¿Qué podés hacer en PLANIT?
            </h2>
            <p
              className="text-gray-500 text-sm mt-3"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Una plataforma, dos perfiles, un solo lugar para gestionar todo.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[520px] border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#FFF0E6" }}>
                  <th
                    className="text-left px-6 py-4 text-sm font-bold text-gray-700 w-[60%]"
                    style={{ fontFamily: "var(--font-poppins)" }}
                  >
                    ¿Qué puedo hacer?
                  </th>
                  <th
                    className="text-center px-4 py-4 text-sm font-bold w-[20%]"
                    style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
                  >
                    Organizador
                  </th>
                  <th
                    className="text-center px-4 py-4 text-sm font-bold w-[20%]"
                    style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
                  >
                    Proveedor
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { accion: "Ver precios y disponibilidad",          org: true,  prov: false },
                  { accion: "Comparar proveedores",                   org: true,  prov: false },
                  { accion: "Reservar fechas",                        org: true,  prov: false },
                  { accion: "Pagar señas de forma segura",            org: true,  prov: false },
                  { accion: "Crear perfil profesional",               org: false, prov: true  },
                  { accion: "Gestionar calendario de disponibilidad", org: false, prov: true  },
                  { accion: "Recibir solicitudes de reserva",         org: false, prov: true  },
                  { accion: "Aceptar o rechazar reservas",            org: false, prov: true  },
                  { accion: "Recibir pagos automáticamente",          org: false, prov: true  },
                  { accion: "Ver historial de reservas y pagos",      org: true,  prov: true  },
                ].map((row, i) => (
                  <tr
                    key={row.accion}
                    style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#FAFAFA" }}
                  >
                    <td
                      className="px-6 py-3.5 text-sm text-gray-700"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {row.accion}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {row.org && (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
                          style={{ backgroundColor: "#2E7D4F" }}
                        >
                          ✓
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {row.prov && (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
                          style={{ backgroundColor: "#2E7D4F" }}
                        >
                          ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="/servicios"
              className="cta-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Explorar servicios →
            </a>
            <a
              href="/cuenta"
              className="cta-button inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Registrarme como proveedor →
            </a>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────
          SECCIÓN INSTITUCIONAL
      ───────────────────────────────────────────── */}
      <section
        id="institucional"
        className="bg-[#FAF7F2] py-20 px-4 sm:px-10 lg:px-20"
      >
        <div className="max-w-6xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-14">
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{ color: "#E8731A", fontFamily: "var(--font-poppins)" }}
            >
              Conócenos
            </h2>
          </div>

          {/* Cards institucionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {institucionalBlocks.map((block) => (
              <div
                key={block.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col gap-4 card-institucional"
              >
                <span className="text-4xl">{block.icon}</span>
                <h3
                  className="text-xl font-bold"
                  style={{ color: "#E8731A", fontFamily: "var(--font-poppins)" }}
                >
                  {block.title}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed text-sm sm:text-base"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {block.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          FOOTER
      ───────────────────────────────────────────── */}
      <footer
        className="py-8 text-center text-white text-sm font-medium"
        style={{ backgroundColor: "#E8731A" }}
      >
        © {new Date().getFullYear()} PLANIT — Marketplace de servicios para eventos en Argentina.
      </footer>
    </main>
  );
}
