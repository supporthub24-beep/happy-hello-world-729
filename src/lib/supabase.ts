import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Surfaced early so misconfigured environments fail loudly instead of
  // silently returning empty data from every query.
  console.warn(
    "Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
  );
}

/**
 * The Supabase client is only created when both environment values are present.
 * When they are missing we expose a proxy that throws a readable error on use
 * instead of letting `createClient` crash the whole app with a blank screen.
 */
function createUnconfiguredClient(): SupabaseClient {
  const message =
    "Supabase কনফিগার করা নেই। VITE_SUPABASE_URL এবং VITE_SUPABASE_ANON_KEY সেট করুন।";

  const throwUnconfigured = (): never => {
    throw new Error(message);
  };

  return new Proxy({} as SupabaseClient, {
    get(_target, property) {
      if (property === "auth") {
        return new Proxy(
          {},
          {
            get(_authTarget, authProperty) {
              if (authProperty === "getSession") {
                return async () => ({ data: { session: null }, error: null });
              }
              if (authProperty === "onAuthStateChange") {
                return () => ({
                  data: { subscription: { unsubscribe: () => {} } },
                });
              }
              return throwUnconfigured;
            },
          },
        );
      }
      if (property === "from") {
        return throwUnconfigured;
      }
      return throwUnconfigured;
    },
  });
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createUnconfiguredClient();
