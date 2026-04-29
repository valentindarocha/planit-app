export interface Proveedor {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string;
  ubicacion: string;
  precioBase: string;
  precioTotal: string;
  precioSena: string;
  rating: number;
  especialidades: string[];
  eventosRealizados: number;
  descripcion: string;
  galeria: string[];
  fechasOcupadas: string[];
}

/* Tipo unificado para mostrar en el catálogo: cubre tanto mocks como proveedores
   reales de Supabase. Los campos opcionales son los que Supabase puede no tener aún. */
export interface ProveedorUnificado {
  id: string;
  nombre: string;
  categoria: string;
  imagen: string | null;       // null → mostrar inicial como placeholder
  ubicacion: string;
  precioBase: string;
  precioTotal: string;
  precioSena: string;
  rating: number | null;       // null → mostrar badge "Nuevo"
  especialidades: string[];
  eventosRealizados: number;
  descripcion: string;
  galeria: string[];
  fechasOcupadas: string[];
  isMock: boolean;
}

export function mockToUnificado(p: Proveedor): ProveedorUnificado {
  return { ...p, isMock: true };
}

export const proveedores: Proveedor[] = [

  /* ── DJs ── */
  {
    id: "dj-matias-lopez",
    nombre: "DJ Matías López",
    categoria: "djs",
    imagen: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Palermo, CABA",
    precioBase: "Desde $85.000",
    rating: 4.8,
    especialidades: ["Bodas", "Fiestas privadas", "Aniversarios"],
    eventosRealizados: 89,
    precioTotal: "$350.000",
    precioSena: "$70.000",
    descripcion: "Especialista en bodas y eventos privados con más de 8 años de experiencia en la escena de Buenos Aires. Equipo profesional de sonido e iluminación incluido en todos los servicios, sin costo adicional. Sus sets personalizados garantizan que cada evento tenga la música perfecta para cada momento.",
    galeria: [
      "https://images.unsplash.com/photo-1571266028243-d220c6a5b0da?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-25",
      "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-16", "2026-05-24",
    ],
  },
  {
    id: "dj-valentina-cruz",
    nombre: "DJ Valentina Cruz",
    categoria: "djs",
    imagen: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&auto=format&fit=crop",
    ubicacion: "San Isidro, GBA Norte",
    precioBase: "Desde $70.000",
    rating: 4.5,
    especialidades: ["Fiestas de XV", "Cumpleaños", "Graduaciones"],
    eventosRealizados: 34,
    precioTotal: "$280.000",
    precioSena: "$56.000",
    descripcion: "DJ femenina con estilo fresco y contemporáneo, especializada en fiestas de quince y cumpleaños. Maneja una variedad de géneros que van desde pop latino hasta reggaeton y electrónica. Ofrece coordinación de música con animación y juegos de luces incluidos en todos sus paquetes.",
    galeria: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571266028243-d220c6a5b0da?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-06", "2026-04-13", "2026-04-20", "2026-04-26",
      "2026-05-03", "2026-05-10", "2026-05-17", "2026-05-30",
    ],
  },
  {
    id: "dj-rodrigo-ferraro",
    nombre: 'DJ Rodrigo "El Fino" Ferraro',
    categoria: "djs",
    imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Belgrano, CABA",
    precioBase: "Desde $95.000",
    rating: 4.9,
    especialidades: ["Eventos empresariales", "Bodas", "Fiestas privadas", "Aniversarios"],
    eventosRealizados: 156,
    precioTotal: "$420.000",
    precioSena: "$95.000",
    descripcion: "Con más de 15 años en la industria y 156 eventos realizados, El Fino es uno de los DJs más reconocidos de Buenos Aires. Especialista en eventos empresariales y bodas de alto perfil, ofrece una propuesta audiovisual completa con sonido e iluminación premium. Su profesionalismo y versatilidad musical lo distinguen claramente en el mercado.",
    galeria: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571266028243-d220c6a5b0da?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-12", "2026-04-25", "2026-04-26",
      "2026-05-01", "2026-05-02", "2026-05-09", "2026-05-16", "2026-05-17", "2026-05-23", "2026-05-30",
    ],
  },
  {
    id: "dj-lucia-mendoza",
    nombre: "DJ Lucía Mendoza",
    categoria: "djs",
    imagen: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Vicente López, GBA Norte",
    precioBase: "Desde $60.000",
    rating: 4.3,
    especialidades: ["Cumpleaños", "Baby showers", "Fiestas de XV"],
    eventosRealizados: 12,
    precioTotal: "$240.000",
    precioSena: "$48.000",
    descripcion: "DJ joven y energética con un perfil versátil y fresco, ideal para cumpleaños infantiles, baby showers y eventos familiares. Sus playlists son 100% personalizadas según los gustos del cliente y el tipo de celebración. Ofrecemos los precios más competitivos del GBA Norte con excelente calidad de sonido.",
    galeria: [
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-12", "2026-04-26",
      "2026-05-09", "2026-05-23",
    ],
  },

  /* ── Bandas ── */
  {
    id: "banda-los-resonantes",
    nombre: "Banda Los Resonantes",
    categoria: "bandas",
    imagen: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Palermo, CABA",
    precioBase: "Desde $150.000",
    rating: 4.7,
    especialidades: ["Bodas", "Aniversarios", "Fiestas privadas"],
    eventosRealizados: 67,
    precioTotal: "$550.000",
    precioSena: "$120.000",
    descripcion: "Banda versátil de 5 integrantes que domina desde clásicos del rock hasta hits contemporáneos en español e inglés. Incluye sonido, iluminación básica y dos sets de 45 minutos con intervalo. Adaptamos el repertorio completo a cada tipo de evento y público.",
    galeria: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eaa54b28a68c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-25",
      "2026-05-02", "2026-05-16", "2026-05-23", "2026-05-30",
    ],
  },
  {
    id: "cuarteto-la-bohemia",
    nombre: "Cuarteto La Bohemia",
    categoria: "bandas",
    imagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop",
    ubicacion: "San Telmo, CABA",
    precioBase: "Desde $120.000",
    rating: 4.6,
    especialidades: ["Eventos empresariales", "Graduaciones", "Aniversarios"],
    eventosRealizados: 43,
    precioTotal: "$480.000",
    precioSena: "$100.000",
    descripcion: "Cuarteto de cuerdas clásico con toque moderno, perfecto para ceremonias, cocktails y eventos de alto nivel. El repertorio abarca desde Piazzolla hasta versiones instrumentales de canciones populares actuales. Ideal para darle un toque sofisticado y diferencial a cualquier celebración.",
    galeria: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eaa54b28a68c?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-11", "2026-04-18", "2026-04-24",
      "2026-05-08", "2026-05-15", "2026-05-22", "2026-05-29",
    ],
  },
  {
    id: "the-silver-notes",
    nombre: "The Silver Notes",
    categoria: "bandas",
    imagen: "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Belgrano, CABA",
    precioBase: "Desde $180.000",
    rating: 4.9,
    especialidades: ["Bodas", "Eventos empresariales", "Fiestas privadas", "Aniversarios"],
    eventosRealizados: 128,
    precioTotal: "$750.000",
    precioSena: "$180.000",
    descripcion: "La banda de eventos más solicitada de Buenos Aires, con repertorio de más de 200 canciones en varios géneros e idiomas. Tres vocalistas, músicos de primer nivel y producción técnica completa incluida en cada contratación. Referentes indiscutidos en bodas y eventos empresariales de alto nivel en Argentina.",
    galeria: [
      "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eaa54b28a68c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-12", "2026-04-19", "2026-04-25", "2026-04-26",
      "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-10", "2026-05-16", "2026-05-17", "2026-05-23", "2026-05-24",
    ],
  },
  {
    id: "grupo-musical-vertigo",
    nombre: "Grupo Musical Vértigo",
    categoria: "bandas",
    imagen: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Flores, CABA",
    precioBase: "Desde $100.000",
    rating: 4.2,
    especialidades: ["Cumpleaños", "Fiestas de XV", "Fiestas privadas"],
    eventosRealizados: 21,
    precioTotal: "$400.000",
    precioSena: "$90.000",
    descripcion: "Banda tropical y cumbianchera ideal para fiestas populares y celebraciones familiares en Buenos Aires. Shows de alta energía con vocalistas y coreografía incluida para animar a todos los invitados. Especialistas en hacer bailar a todos, desde los más chicos hasta los más grandes.",
    galeria: [
      "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501386761578-eaa54b28a68c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-19", "2026-04-26",
      "2026-05-03", "2026-05-17", "2026-05-31",
    ],
  },

  /* ── Fotógrafos / Videógrafos ── */
  {
    id: "studio-lumiere",
    nombre: "Foto & Video Studio Lumière",
    categoria: "fotografos-videografos",
    imagen: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Palermo, CABA",
    precioBase: "Desde $120.000",
    rating: 4.9,
    especialidades: ["Bodas", "Fiestas de XV", "Aniversarios"],
    eventosRealizados: 203,
    precioTotal: "$480.000",
    precioSena: "$110.000",
    descripcion: "Estudio con más de 10 años de experiencia en fotografía y video para eventos sociales en Buenos Aires. Un equipo de dos fotógrafos y un videógrafo trabaja en simultáneo para capturar cada momento desde múltiples ángulos. La entrega incluye álbum digital de más de 500 fotos editadas, video de highlights y edición profesional completa.",
    galeria: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-12", "2026-04-19", "2026-04-25", "2026-04-26",
      "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-10", "2026-05-16", "2026-05-23", "2026-05-24",
    ],
  },
  {
    id: "captura-viva",
    nombre: "Captura Viva",
    categoria: "fotografos-videografos",
    imagen: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Recoleta, CABA",
    precioBase: "Desde $90.000",
    rating: 4.6,
    especialidades: ["Eventos empresariales", "Graduaciones", "Cumpleaños"],
    eventosRealizados: 78,
    precioTotal: "$360.000",
    precioSena: "$75.000",
    descripcion: "Fotografía documental y periodística aplicada a eventos: fotos naturales, espontáneas, sin poses forzadas. Especialistas en eventos corporativos con entrega rápida para comunicación institucional e interna. Edición profesional y entrega del material completo en un máximo de 72 horas hábiles.",
    galeria: [
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-09", "2026-04-16", "2026-04-23", "2026-04-24",
      "2026-05-07", "2026-05-14", "2026-05-21", "2026-05-28",
    ],
  },
  {
    id: "lente-y-luz",
    nombre: "Lente & Luz Producciones",
    categoria: "fotografos-videografos",
    imagen: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80&auto=format&fit=crop",
    ubicacion: "San Isidro, GBA Norte",
    precioBase: "Desde $110.000",
    rating: 4.7,
    especialidades: ["Bodas", "Baby showers", "Fiestas privadas", "Aniversarios"],
    eventosRealizados: 95,
    precioTotal: "$440.000",
    precioSena: "$100.000",
    descripcion: "Dúo fotógrafo-videógrafo con estilo cinematográfico y atención al detalle que cuenta historias a través de las imágenes. Cada proyecto incluye sesión de pre-evento, cobertura completa del día y mini-film de 3 minutos con música. Especializados en bodas íntimas y celebraciones familiares de alto vuelo.",
    galeria: [
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-05", "2026-04-11", "2026-04-18", "2026-04-25",
      "2026-05-02", "2026-05-09", "2026-05-16", "2026-05-23",
    ],
  },
  {
    id: "momentos-que-quedan",
    nombre: "Momentos que Quedan",
    categoria: "fotografos-videografos",
    imagen: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Caballito, CABA",
    precioBase: "Desde $75.000",
    rating: 4.4,
    especialidades: ["Cumpleaños", "Baby showers", "Fiestas de XV"],
    eventosRealizados: 28,
    precioTotal: "$300.000",
    precioSena: "$60.000",
    descripcion: "Fotógrafo independiente con enfoque cálido y emotivo, ideal para eventos familiares y celebraciones íntimas. Sus fotos cuentan la historia del evento de manera natural y espontánea, sin interrumpir los momentos más importantes. Paquetes accesibles con excelente relación calidad-precio para familias de CABA.",
    galeria: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-18", "2026-04-25",
      "2026-05-09", "2026-05-23",
    ],
  },

  /* ── Catering / Chefs ── */
  {
    id: "chefs-table-eventos",
    nombre: "Chef's Table Eventos",
    categoria: "catering-chefs",
    imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Palermo, CABA",
    precioBase: "Desde $200.000",
    rating: 4.8,
    especialidades: ["Bodas", "Eventos empresariales", "Aniversarios"],
    eventosRealizados: 112,
    precioTotal: "$800.000",
    precioSena: "$180.000",
    descripcion: "Servicio de catering gourmet con chef ejecutivo a cargo de cada evento, garantizando la más alta calidad gastronómica. Los menús son completamente personalizados con opciones vegetarianas, veganas y sin TACC disponibles para todos los invitados. El servicio incluye vajilla premium, mozos capacitados y montaje completo del espacio.",
    galeria: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-18", "2026-04-25", "2026-04-26",
      "2026-05-02", "2026-05-09", "2026-05-16", "2026-05-23", "2026-05-30",
    ],
  },
  {
    id: "gastronomia-del-rio",
    nombre: "Gastronomía del Río",
    categoria: "catering-chefs",
    imagen: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Vicente López, GBA Norte",
    precioBase: "Desde $160.000",
    rating: 4.5,
    especialidades: ["Fiestas privadas", "Graduaciones", "Cumpleaños", "Aniversarios"],
    eventosRealizados: 56,
    precioTotal: "$640.000",
    precioSena: "$140.000",
    descripcion: "Catering especializado en cocina argentina contemporánea con productos regionales frescos de temporada. Ofrecemos desde desayunos de trabajo hasta cenas de gala, adaptando la propuesta a cada tipo de evento y presupuesto. Personal capacitado y presentación impecable en cada uno de nuestros servicios.",
    galeria: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-11", "2026-04-18", "2026-04-25",
      "2026-05-02", "2026-05-16", "2026-05-23",
    ],
  },
  {
    id: "sabores-portenos",
    nombre: "Sabores Porteños Catering",
    categoria: "catering-chefs",
    imagen: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop",
    ubicacion: "San Telmo, CABA",
    precioBase: "Desde $140.000",
    rating: 4.7,
    especialidades: ["Fiestas de XV", "Bodas", "Baby showers"],
    eventosRealizados: 74,
    precioTotal: "$560.000",
    precioSena: "$120.000",
    descripcion: "El auténtico sabor porteño llevado a cada evento con ingredientes frescos y de primera calidad seleccionados a diario. Parrilla, pastas artesanales, empanadas y postres caseros son nuestras grandes especialidades. Ideal para eventos que buscan un toque familiar, cálido y auténticamente argentino.",
    galeria: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-26",
      "2026-05-03", "2026-05-10", "2026-05-17", "2026-05-24",
    ],
  },
  {
    id: "cocina-de-autor",
    nombre: "Cocina de Autor",
    categoria: "catering-chefs",
    imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Olivos, GBA Norte",
    precioBase: "Desde $220.000",
    rating: 4.9,
    especialidades: ["Bodas", "Eventos empresariales", "Fiestas privadas", "Graduaciones"],
    eventosRealizados: 189,
    precioTotal: "$880.000",
    precioSena: "$220.000",
    descripcion: "Propuesta gastronómica única con la firma del reconocido chef Gonzalo Rivas, referente de la alta cocina argentina. Cada menú es una experiencia culinaria exclusiva, diseñada específicamente para el evento y los gustos del cliente. Ingredientes importados, técnicas de alta cocina y presentaciones de autor en cada servicio.",
    galeria: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-12", "2026-04-18", "2026-04-25", "2026-04-26",
      "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-16", "2026-05-17", "2026-05-23", "2026-05-30",
    ],
  },

  /* ── Lugares ── */
  {
    id: "salon-villa-crespo-garden",
    nombre: "Villa Crespo Garden Salón",
    categoria: "lugares",
    imagen: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Villa Crespo, CABA",
    precioBase: "Desde $300.000",
    rating: 4.6,
    especialidades: ["Bodas", "Cumpleaños", "Fiestas privadas"],
    eventosRealizados: 145,
    precioTotal: "$1.200.000",
    precioSena: "$280.000",
    descripcion: "Salón con jardín privado en pleno Villa Crespo con capacidad para hasta 200 personas en formato cena o 300 en cocktail. Estacionamiento propio con acceso para 40 vehículos, cocina equipada y espacio para ambientación completamente personalizada. El salón se adapta a ceremonias civiles, fiestas sociales y eventos corporativos.",
    galeria: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561489396-888724a1543d?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-05", "2026-04-12", "2026-04-18", "2026-04-19", "2026-04-25", "2026-04-26",
      "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-10", "2026-05-16", "2026-05-17", "2026-05-23", "2026-05-24",
    ],
  },
  {
    id: "casa-belgrano-events",
    nombre: "Casa Belgrano Events",
    categoria: "lugares",
    imagen: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Belgrano, CABA",
    precioBase: "Desde $450.000",
    rating: 4.8,
    especialidades: ["Eventos empresariales", "Bodas", "Graduaciones", "Aniversarios"],
    eventosRealizados: 98,
    precioTotal: "$1.800.000",
    precioSena: "$400.000",
    descripcion: "Casona histórica de Belgrano del año 1920, reconvertida en espacio de eventos de lujo con todo el encanto patrimonial. Tres salones con capacidad flexible de hasta 250 personas, patio colonial empedrado y jardín arbolado con pérgola. El lugar ideal para eventos que buscan elegancia, historia y distinción en el corazón de CABA.",
    galeria: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-11", "2026-04-18", "2026-04-25",
      "2026-05-02", "2026-05-09", "2026-05-16", "2026-05-23", "2026-05-30",
    ],
  },
  {
    id: "quinta-san-isidro",
    nombre: "Quinta San Isidro",
    categoria: "lugares",
    imagen: "https://images.unsplash.com/photo-1561489396-888724a1543d?w=800&q=80&auto=format&fit=crop",
    ubicacion: "San Isidro, GBA Norte",
    precioBase: "Desde $550.000",
    rating: 4.9,
    especialidades: ["Bodas", "Fiestas de XV", "Aniversarios", "Fiestas privadas"],
    eventosRealizados: 234,
    precioTotal: "$2.200.000",
    precioSena: "$500.000",
    descripcion: "Quinta privada sobre el Río de la Plata con vistas panorámicas espectaculares y parque de 5000 m² con arboleda centenaria. Capacidad para hasta 400 personas con opciones de carpa climatizada, salón interior y espacio al aire libre. La locación número uno para bodas y quinceañeros en el GBA Norte desde hace más de 20 años.",
    galeria: [
      "https://images.unsplash.com/photo-1561489396-888724a1543d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-12", "2026-04-18", "2026-04-19", "2026-04-25", "2026-04-26",
      "2026-05-02", "2026-05-03", "2026-05-09", "2026-05-10", "2026-05-16", "2026-05-17", "2026-05-23", "2026-05-24", "2026-05-30",
    ],
  },
  {
    id: "terraza-palermo",
    nombre: "Terraza Palermo",
    categoria: "lugares",
    imagen: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Palermo, CABA",
    precioBase: "Desde $380.000",
    rating: 4.4,
    especialidades: ["Fiestas privadas", "Cumpleaños", "Baby showers"],
    eventosRealizados: 61,
    precioTotal: "$1.500.000",
    precioSena: "$350.000",
    descripcion: "Terraza techada con vista panorámica a los tejados de Palermo y el skyline de Buenos Aires. Capacidad para hasta 120 personas en formato cocktail o 80 en cena sentada, con bar integrado y área de kitchen disponible. Ambiente urbano, moderno y luminoso, con toda la magia de la ciudad como escenario de fondo.",
    galeria: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-11", "2026-04-18", "2026-04-25",
      "2026-05-09", "2026-05-16", "2026-05-23",
    ],
  },

  /* ── Organizadores de eventos ── */
  {
    id: "eventos-con-alma",
    nombre: "Eventos con Alma",
    categoria: "organizadores",
    imagen: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Recoleta, CABA",
    precioBase: "Desde $180.000",
    rating: 4.8,
    especialidades: ["Bodas", "Fiestas de XV", "Aniversarios"],
    eventosRealizados: 87,
    precioTotal: "$720.000",
    precioSena: "$160.000",
    descripcion: "Empresa de organización integral de eventos con foco en bodas íntimas y celebraciones con identidad propia. Nos encargamos de todo: selección de proveedores, decoración, cronograma del día y coordinación en tiempo real. Más de 80 parejas y familias felices avalan nuestra trayectoria en Buenos Aires.",
    galeria: [
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-05", "2026-04-12", "2026-04-19", "2026-04-25",
      "2026-05-02", "2026-05-10", "2026-05-16", "2026-05-23",
    ],
  },
  {
    id: "coordina-eventos-ba",
    nombre: "Coordina Eventos BA",
    categoria: "organizadores",
    imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Palermo, CABA",
    precioBase: "Desde $150.000",
    rating: 4.6,
    especialidades: ["Eventos empresariales", "Graduaciones", "Fiestas privadas"],
    eventosRealizados: 53,
    precioTotal: "$600.000",
    precioSena: "$130.000",
    descripcion: "Coordinación profesional para eventos corporativos y sociales en Buenos Aires con un equipo de 6 profesionales dedicados. Gestionamos el 100% de los proveedores, la logística integral y el protocolo del evento. Nuestro equipo garantiza que el día del evento todo fluya sin imprevistos ni sorpresas.",
    galeria: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-09", "2026-04-16", "2026-04-23",
      "2026-05-07", "2026-05-14", "2026-05-21", "2026-05-28",
    ],
  },
  {
    id: "tu-evento-perfecto",
    nombre: "Tu Evento Perfecto",
    categoria: "organizadores",
    imagen: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop",
    ubicacion: "San Isidro, GBA Norte",
    precioBase: "Desde $200.000",
    rating: 4.7,
    especialidades: ["Bodas", "Eventos empresariales", "Aniversarios", "Fiestas privadas"],
    eventosRealizados: 119,
    precioTotal: "$800.000",
    precioSena: "$180.000",
    descripcion: "Organizadores de eventos con presencia en CABA y GBA Norte, especializados en bodas y eventos empresariales de mediana y gran escala. Trabajamos con una red de más de 50 proveedores certificados para ofrecer soluciones llave en mano en cualquier tipo de celebración. Acompañamiento personalizado desde la primera reunión hasta el último brindis.",
    galeria: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-04", "2026-04-05", "2026-04-11", "2026-04-12", "2026-04-18", "2026-04-25",
      "2026-05-02", "2026-05-09", "2026-05-16", "2026-05-23", "2026-05-30",
    ],
  },
  {
    id: "momentos-unicos",
    nombre: "Momentos Únicos Organización",
    categoria: "organizadores",
    imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
    ubicacion: "Belgrano, CABA",
    precioBase: "Desde $170.000",
    rating: 4.5,
    especialidades: ["Cumpleaños", "Baby showers", "Graduaciones"],
    eventosRealizados: 42,
    precioTotal: "$680.000",
    precioSena: "$150.000",
    descripcion: "Organización de eventos familiares y sociales con calidez humana y atención completamente personalizada. Coordinamos cada detalle para que el cliente solo disfrute del día sin preocupaciones. Especialistas en cumpleaños de adultos, baby showers, despedidas y graduaciones en toda la Ciudad de Buenos Aires.",
    galeria: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80&auto=format&fit=crop",
    ],
    fechasOcupadas: [
      "2026-04-18", "2026-04-19", "2026-04-25",
      "2026-05-09", "2026-05-17", "2026-05-23",
    ],
  },
];

/* Mapa slug → nombre legible */
export const categoriaNombres: Record<string, string> = {
  "djs":                    "DJs",
  "bandas":                 "Bandas",
  "fotografos-videografos": "Fotógrafos / Videógrafos",
  "catering-chefs":         "Catering / Chefs",
  "lugares":                "Lugares",
  "organizadores":          "Organizadores de eventos",
};
