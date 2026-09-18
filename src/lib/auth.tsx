import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type AuthProfile = {
  id: string;
  full_name: string;
  email: string;
};

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  displayName: string;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function fallbackName(user: User | null): string {
  if (!user) return "";
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const metaName = typeof meta.full_name === "string" ? meta.full_name : "";
  if (metaName.trim()) return metaName.trim();
  if (user.email) return user.email.split("@")[0];
  return "Staff";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      setProfile({
        id: user.id,
        full_name: fallbackName(user),
        email: user.email ?? "",
      });
      return;
    }

    if (data) {
      setProfile({
        id: data.id,
        full_name: data.full_name || fallbackName(user),
        email: data.email || user.email || "",
      });
      return;
    }

    const newProfile = {
      id: user.id,
      full_name: fallbackName(user),
      email: user.email ?? "",
    };

    const { error: insertError } = await supabase
      .from("profiles")
      .upsert(newProfile, { onConflict: "id" });

    if (insertError) {
      setProfile(newProfile);
      return;
    }

    setProfile(newProfile);
  }, []);

  useEffect(() => {
    let active = true;

    const init = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session ?? null);
      await loadProfile(data.session?.user ?? null);
      if (active) setLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      void loadProfile(nextSession?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError(signInError.message);
      return { error: signInError.message };
    }
    return { error: null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setError(null);
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return { error: signUpError.message };
      }
      return { error: null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    setError(null);
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      displayName:
        profile?.full_name?.trim() ||
        fallbackName(session?.user ?? null) ||
        "Staff",
    }),
    [session, profile, loading, error, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
