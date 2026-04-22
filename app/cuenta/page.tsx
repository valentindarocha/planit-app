"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Tipos
───────────────────────────────────────────── */
type Tab    = "login" | "registro";
type Rol    = "organizador" | "proveedor" | null;
type RegStep = "rol" | "form";

/* ─────────────────────────────────────────────
   Íconos SVG inline
───────────────────────────────────────────── */
function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="12" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconEye({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Toast de notificación
───────────────────────────────────────────── */
function Toast({ mensaje, tipo, onClose }: {
  mensaje: string;
  tipo: "exito" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-semibold animate-toast-in"
      style={{
        fontFamily: "var(--font-poppins)",
        backgroundColor: tipo === "exito" ? "#DCFCE7" : "#FEE2E2",
        color: tipo === "exito" ? "#15803D" : "#B91C1C",
        minWidth: "240px",
      }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: tipo === "exito" ? "#15803D" : "#B91C1C", color: "white" }}
      >
        {tipo === "exito" ? <IconCheck /> : "✕"}
      </span>
      {mensaje}
      <style jsx>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .animate-toast-in { animation: toastIn 0.22s ease-out; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Input reutilizable con focus naranja
───────────────────────────────────────────── */
function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  suffix,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold text-gray-700"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
          style={{
            fontFamily: "var(--font-poppins)",
            borderColor: error ? "#DC2626" : "#E5E7EB",
            backgroundColor: error ? "#FEF2F2" : "#FFFFFF",
            paddingRight: suffix ? "44px" : undefined,
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#E8731A";
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = "#E5E7EB";
          }}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[11px] text-red-600" style={{ fontFamily: "var(--font-poppins)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Select reutilizable con focus naranja
───────────────────────────────────────────── */
function Select({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-semibold text-gray-700"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none bg-white"
        style={{
          fontFamily: "var(--font-poppins)",
          borderColor: error ? "#DC2626" : "#E5E7EB",
          backgroundColor: error ? "#FEF2F2" : "#FFFFFF",
        }}
        onFocus={(e) => {
          if (!error) e.currentTarget.style.borderColor = "#E8731A";
        }}
        onBlur={(e) => {
          if (!error) e.currentTarget.style.borderColor = "#E5E7EB";
        }}
      >
        <option value="">Seleccioná una categoría</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && (
        <p className="text-[11px] text-red-600" style={{ fontFamily: "var(--font-poppins)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Constantes
───────────────────────────────────────────── */
const CATEGORIAS = [
  { value: "djs",                    label: "DJs" },
  { value: "bandas",                 label: "Bandas" },
  { value: "fotografos-videografos", label: "Fotógrafos / Videógrafos" },
  { value: "catering-chefs",         label: "Catering / Chefs" },
  { value: "lugares",                label: "Lugares" },
  { value: "organizadores",          label: "Organizadores de eventos" },
];

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─────────────────────────────────────────────
   Formulario de Login
───────────────────────────────────────────── */
function FormLogin({
  onIrARegistro,
  onExito,
}: {
  onIrARegistro: () => void;
  onExito: () => void;
}) {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [errores, setErrores]     = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2: typeof errores = {};
    if (!email.trim())          e2.email    = "El email es obligatorio";
    else if (!validarEmail(email)) e2.email = "Ingresá un email válido";
    if (!password)              e2.password = "La contraseña es obligatoria";
    setErrores(e2);
    if (Object.keys(e2).length === 0) onExito();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(v) => { setEmail(v); setErrores((p) => ({ ...p, email: undefined })); }}
        error={errores.email}
      />
      <Input
        label="Contraseña"
        type={showPass ? "text" : "password"}
        placeholder="Tu contraseña"
        value={password}
        onChange={(v) => { setPassword(v); setErrores((p) => ({ ...p, password: undefined })); }}
        error={errores.password}
        suffix={
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="hover:text-orange-500 transition-colors"
          >
            <IconEye open={showPass} />
          </button>
        }
      />

      <button
        type="submit"
        className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm mt-1"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        Iniciar sesión
      </button>

      <p
        className="text-center text-xs text-gray-500"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        ¿No tenés cuenta?{" "}
        <button
          type="button"
          onClick={onIrARegistro}
          className="font-semibold hover:underline"
          style={{ color: "#E8731A" }}
        >
          Registrate
        </button>
      </p>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Paso de selección de rol
───────────────────────────────────────────── */
function PasoRol({
  seleccionado,
  onSeleccionar,
}: {
  seleccionado: Rol;
  onSeleccionar: (r: Rol) => void;
}) {
  const cards: { id: "organizador" | "proveedor"; titulo: string; subtexto: string; icono: React.ReactNode }[] = [
    {
      id: "organizador",
      titulo: "Soy Organizador",
      subtexto: "Quiero buscar y reservar proveedores para mi evento",
      icono: <IconCalendar />,
    },
    {
      id: "proveedor",
      titulo: "Soy Proveedor",
      subtexto: "Quiero ofrecer mis servicios y recibir reservas",
      icono: <IconBriefcase />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <p
          className="text-sm text-gray-500"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          ¿Cómo vas a usar PLANIT?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const activo = seleccionado === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSeleccionar(card.id)}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 text-center transition-all duration-200 hover:shadow-md"
              style={{
                fontFamily: "var(--font-poppins)",
                borderColor: activo ? "#E8731A" : "#E5E7EB",
                backgroundColor: activo ? "#FFF0E6" : "#FFFFFF",
                color: activo ? "#C25E10" : "#374151",
              }}
            >
              <span style={{ color: activo ? "#E8731A" : "#9CA3AF" }}>
                {card.icono}
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold">{card.titulo}</span>
                <span className="text-[11px] leading-snug" style={{ color: activo ? "#C25E10" : "#6B7280" }}>
                  {card.subtexto}
                </span>
              </div>
              {activo && (
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E8731A", color: "white" }}
                >
                  <IconCheck />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Formulario de Registro
───────────────────────────────────────────── */
function FormRegistro({
  onIrALogin,
  onExito,
}: {
  onIrALogin: () => void;
  onExito: () => void;
}) {
  const [step, setStep]         = useState<RegStep>("rol");
  const [rol, setRol]           = useState<Rol>(null);

  const [nombre, setNombre]     = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [categoria, setCategoria] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  type CampoReg = "nombre" | "email" | "password" | "confirm" | "categoria" | "rol";
  const [errores, setErrores] = useState<Partial<Record<CampoReg, string>>>({});

  function limpiarError(campo: CampoReg) {
    setErrores((p) => ({ ...p, [campo]: undefined }));
  }

  function handleContinuar() {
    if (!rol) {
      setErrores({ rol: "Seleccioná un tipo de cuenta para continuar" });
      return;
    }
    setErrores({});
    setStep("form");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const e2: Partial<Record<CampoReg, string>> = {};

    if (!nombre.trim())             e2.nombre   = "El nombre es obligatorio";
    if (!email.trim())              e2.email    = "El email es obligatorio";
    else if (!validarEmail(email))  e2.email    = "Ingresá un email válido";
    if (!password)                  e2.password = "La contraseña es obligatoria";
    else if (password.length < 8)   e2.password = "Mínimo 8 caracteres";
    if (!confirm)                   e2.confirm  = "Confirmá tu contraseña";
    else if (confirm !== password)  e2.confirm  = "Las contraseñas no coinciden";
    if (rol === "proveedor" && !categoria) e2.categoria = "Seleccioná tu categoría de servicio";

    setErrores(e2);
    if (Object.keys(e2).length === 0) onExito();
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Paso 1: Selección de rol ── */}
      {step === "rol" && (
        <div className="flex flex-col gap-5 animate-step-in">
          <PasoRol seleccionado={rol} onSeleccionar={(r) => { setRol(r); limpiarError("rol"); }} />

          {errores.rol && (
            <p className="text-[11px] text-red-600 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
              {errores.rol}
            </p>
          )}

          <button
            type="button"
            onClick={handleContinuar}
            disabled={!rol}
            className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Continuar
          </button>

          <p
            className="text-center text-xs text-gray-500"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ¿Ya tenés cuenta?{" "}
            <button
              type="button"
              onClick={onIrALogin}
              className="font-semibold hover:underline"
              style={{ color: "#E8731A" }}
            >
              Iniciá sesión
            </button>
          </p>
        </div>
      )}

      {/* ── Paso 2: Formulario de datos ── */}
      {step === "form" && (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 animate-step-in">

          {/* Botón volver + indicador de rol */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep("rol")}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <IconChevronLeft />
              Volver
            </button>
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{
                fontFamily: "var(--font-poppins)",
                backgroundColor: "#FFF0E6",
                color: "#C25E10",
              }}
            >
              {rol === "organizador" ? "Organizador" : "Proveedor"}
            </span>
          </div>

          <Input
            label="Nombre completo"
            placeholder="Tu nombre y apellido"
            value={nombre}
            onChange={(v) => { setNombre(v); limpiarError("nombre"); }}
            error={errores.nombre}
          />

          <Input
            label="Email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(v) => { setEmail(v); limpiarError("email"); }}
            error={errores.email}
          />

          <Input
            label="Contraseña"
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(v) => { setPassword(v); limpiarError("password"); }}
            error={errores.password}
            suffix={
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="hover:text-orange-500 transition-colors"
              >
                <IconEye open={showPass} />
              </button>
            }
          />

          <Input
            label="Confirmar contraseña"
            type={showConf ? "text" : "password"}
            placeholder="Repetí tu contraseña"
            value={confirm}
            onChange={(v) => { setConfirm(v); limpiarError("confirm"); }}
            error={errores.confirm}
            suffix={
              <button
                type="button"
                onClick={() => setShowConf((s) => !s)}
                className="hover:text-orange-500 transition-colors"
              >
                <IconEye open={showConf} />
              </button>
            }
          />

          {rol === "proveedor" && (
            <Select
              label="Categoría de servicio"
              value={categoria}
              onChange={(v) => { setCategoria(v); limpiarError("categoria"); }}
              options={CATEGORIAS}
              error={errores.categoria}
            />
          )}

          <button
            type="submit"
            className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm mt-1"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Crear cuenta
          </button>

          <p
            className="text-center text-xs text-gray-500"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            ¿Ya tenés cuenta?{" "}
            <button
              type="button"
              onClick={onIrALogin}
              className="font-semibold hover:underline"
              style={{ color: "#E8731A" }}
            >
              Iniciá sesión
            </button>
          </p>
        </form>
      )}

      <style jsx>{`
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .animate-step-in { animation: stepIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Página principal
───────────────────────────────────────────── */
export default function CuentaPage() {
  const [tab, setTab]     = useState<Tab>("login");
  const [toast, setToast] = useState<{ mensaje: string; tipo: "exito" | "error" } | null>(null);

  function mostrarToast(mensaje: string, tipo: "exito" | "error") {
    setToast({ mensaje, tipo });
  }

  return (
    <main
      className="flex flex-col flex-1 min-h-screen pt-[50px]"
      style={{ backgroundColor: "#FAF7F2", fontFamily: "var(--font-poppins)" }}
    >
      <div className="flex flex-1 items-start sm:items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">

          {/* Logo / título de la sección */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="text-3xl font-extrabold tracking-widest uppercase"
              style={{ color: "#E8731A", letterSpacing: "0.15em" }}
            >
              PLANIT
            </Link>
            <p className="text-sm text-gray-500 mt-2">
              {tab === "login" ? "Accedé a tu cuenta" : "Creá tu cuenta gratis"}
            </p>
          </div>

          {/* Card contenedora */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            {/* ── Tabs ── */}
            <div
              className="flex border-b"
              style={{ borderColor: "#F0E0D0" }}
            >
              {(["login", "registro"] as Tab[]).map((t) => {
                const activo = tab === t;
                const label  = t === "login" ? "Iniciar sesión" : "Registrarse";
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className="flex-1 py-4 text-sm font-semibold transition-all relative"
                    style={{
                      color: activo ? "#E8731A" : "#9CA3AF",
                      backgroundColor: activo ? "#FFFAF6" : "#FFFFFF",
                    }}
                  >
                    {label}
                    {/* Línea inferior activa */}
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px] transition-all"
                      style={{ backgroundColor: activo ? "#E8731A" : "transparent" }}
                    />
                  </button>
                );
              })}
            </div>

            {/* ── Contenido del form ── */}
            <div className="p-7 sm:p-8">
              {tab === "login" ? (
                <FormLogin
                  key="login"
                  onIrARegistro={() => setTab("registro")}
                  onExito={() => mostrarToast("¡Inicio de sesión exitoso!", "exito")}
                />
              ) : (
                <FormRegistro
                  key="registro"
                  onIrALogin={() => setTab("login")}
                  onExito={() => mostrarToast("¡Cuenta creada correctamente!", "exito")}
                />
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 text-center text-white text-sm font-medium"
        style={{ backgroundColor: "#E8731A" }}
      >
        © {new Date().getFullYear()} PLANIT — Marketplace de servicios para eventos en Argentina.
      </footer>

      {/* Toast */}
      {toast && (
        <Toast
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
