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
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type AuthProfile = {
  id: string;
  full_name: string;
  email: string;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  configured: boolean;
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

const NOT_CONFIGURED_MESSAGE =
  "Supabase কনফিগার করা নেই। VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY সেট করুন।";

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

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session ?? null);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setProfile(null);
      return;
    }

    let active = true;

    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        if (data) {
          setProfile({
            id: data.id as string,
            full_name: (data.full_name as string) ?? "",
            email: (data.email as string) ?? "",
          });
        } else {
          setProfile({
            id: user.id,
            full_name: fallbackName(user),
            email: user.email ?? "",
          });
        }
      })
      .catch(() => {
        if (!active) return;
        setProfile({
          id: user.id,
          full_name: fallbackName(user),
          email: user.email ?? "",
        });
      });

    return () => {
      active = false;
    };
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: NOT_CONFIGURED_MESSAGE };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? error.message : null };
    } catch (cause) {
      return {
        error: cause instanceof Error ? cause.message : NOT_CONFIGURED_MESSAGE,
      };
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!isSupabaseConfigured) {
        return { error: NOT_CONFIGURED_MESSAGE };
      }
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        return { error: error ? error.message : null };
      } catch (cause) {
        return {
          error: cause instanceof Error ? cause.message : NOT_CONFIGURED_MESSAGE,
        };
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore — signing out locally is still safe */
    }
    setProfile(null);
  }, []);

  const displayName = useMemo(() => {
    if (profile?.full_name?.trim()) return profile.full_name.trim();
    return fallbackName(user);
  }, [profile, user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      configured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      displayName,
    }),
    [session, user, profile, loading, signIn, signUp, signOut, displayName],
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
