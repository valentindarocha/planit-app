"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/* ─────────────────────────────────────────────
   Tipos
───────────────────────────────────────────── */
type TipoCuenta = "organizador" | "proveedor" | null;

type AuthContextType = {
  user:            User        | null;
  session:         Session     | null;
  loading:         boolean;
  tipoCuenta:      TipoCuenta;
  avatarUrl:       string | null;
  updateAvatarUrl: (url: string) => void;
  signOut:         () => Promise<void>;
};

/* ─────────────────────────────────────────────
   Contexto
───────────────────────────────────────────── */
const AuthContext = createContext<AuthContextType>({
  user:            null,
  session:         null,
  loading:         true,
  tipoCuenta:      null,
  avatarUrl:       null,
  updateAvatarUrl: () => {},
  signOut:         async () => {},
});

/* ─────────────────────────────────────────────
   Provider
───────────────────────────────────────────── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user,       setUser]       = useState<User    | null>(null);
  const [session,    setSession]    = useState<Session | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [tipoCuenta, setTipoCuenta] = useState<TipoCuenta>(null);
  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(null);

  /* Obtiene tipo_cuenta y foto_perfil desde Profiles */
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("Profiles")
      .select("tipo_cuenta, foto_perfil")
      .eq("ID", userId)
      .single();
    setTipoCuenta((data?.tipo_cuenta as TipoCuenta) ?? null);
    setAvatarUrl(data?.foto_perfil ?? null);
  }, []);

  useEffect(() => {
    /* 1. Recuperar sesión existente al montar.
          Se aguarda fetchProfile para que loading=false solo ocurra
          cuando tipoCuenta ya tenga un valor definitivo. */
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    });

    /* 2. Escuchar cambios de estado de auth.
          Igual: no bajar loading hasta tener el perfil. */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setTipoCuenta(null);
        setAvatarUrl(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  /* Permite que componentes externos actualicen la URL del avatar en el contexto */
  const updateAvatarUrl = useCallback((url: string) => {
    setAvatarUrl(url);
  }, []);

  /* Cierra sesión y redirige */
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setTipoCuenta(null);
    setAvatarUrl(null);
    router.push("/cuenta");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, tipoCuenta, avatarUrl, updateAvatarUrl, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ─────────────────────────────────────────────
   Hook de consumo
───────────────────────────────────────────── */
export function useAuth() {
  return useContext(AuthContext);
}
