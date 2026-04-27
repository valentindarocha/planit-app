"use client";

import { useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */
interface AvatarUploadProps {
  /** UUID del usuario dueño del avatar */
  userId: string;
  /** URL actual guardada en profiles.foto_perfil (puede ser vacío) */
  currentUrl: string;
  /** Nombre para generar el inicial del placeholder */
  nombre: string;
  /** Tamaño en px del círculo (default 72) */
  size?: number;
  /** Callback cuando la subida + update de DB terminan bien */
  onUploaded?: (newUrl: string) => void;
}

/* ─────────────────────────────────────────────
   Ícono cámara
───────────────────────────────────────────── */
function IconCamera() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E8731A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
export default function AvatarUpload({
  userId,
  currentUrl,
  nombre,
  size = 72,
  onUploaded,
}: AvatarUploadProps) {
  const { updateAvatarUrl } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  /* Muestra la URL actual; al subir, se reemplaza con la nueva + cache-buster */
  const [preview,   setPreview]   = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const inicial = nombre.trim()[0]?.toUpperCase() ?? "U";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Validaciones básicas */
    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const ext  = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;

      /* 1. Subir a Supabase Storage (upsert sobreescribe el archivo existente) */
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      /* 2. Obtener URL pública */
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const cleanUrl  = urlData.publicUrl;
      /* Cache-buster para forzar recarga de la imagen en el mismo path */
      const displayUrl = `${cleanUrl}?t=${Date.now()}`;

      /* 3. Actualizar profiles.foto_perfil en la DB */
      const { error: dbError } = await supabase
        .from("Profiles")
        .update({ foto_perfil: cleanUrl })
        .eq("ID", userId);

      if (dbError) throw dbError;

      /* 4. Propagar la nueva URL */
      setPreview(displayUrl);
      updateAvatarUrl(displayUrl);
      onUploaded?.(cleanUrl);
    } catch (err: unknown) {
      console.error("AvatarUpload error:", err);
      setError("No se pudo subir la imagen. Intentá de nuevo.");
    } finally {
      setUploading(false);
      /* Reset para permitir seleccionar el mismo archivo de nuevo */
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {/* ── Círculo del avatar ── */}
      <div
        className="relative flex-shrink-0 group"
        style={{ width: size, height: size }}
      >
        {/* Input de archivo oculto */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Foto o placeholder con inicial */}
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt={nombre}
            className="rounded-full object-cover w-full h-full border-2"
            style={{ borderColor: "#FFF0E6" }}
          />
        ) : (
          <div
            className="rounded-full w-full h-full flex items-center justify-center border-2 font-bold select-none"
            style={{
              backgroundColor: "#FFF0E6",
              color: "#E8731A",
              borderColor: "#FFF0E6",
              fontSize: Math.round(size * 0.38),
            }}
          >
            {inicial}
          </div>
        )}

        {/* Overlay con ícono cámara / spinner */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-label="Cambiar foto de perfil"
          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow-md">
              <IconCamera />
            </span>
          )}
        </button>
      </div>

      {/* ── Botón textual debajo ── */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ color: "#E8731A" }}
      >
        {uploading ? "Subiendo…" : "Cambiar foto de perfil"}
      </button>

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
