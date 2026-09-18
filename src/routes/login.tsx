import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Boxes, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginPage() {
  const { signIn, signUp, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && session) {
      void navigate({ to: "/" });
    }
  }, [authLoading, session, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (mode === "signup" && !fullName.trim()) {
      setError("Enter your full name so entries can be attributed to you.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
          return;
        }
        void navigate({ to: "/" });
      } else {
        const result = await signUp(email, password, fullName);
        if (result.error) {
          setError(result.error);
          return;
        }
        setNotice(
          "Account created. If email confirmation is enabled, check your inbox before signing in.",
        );
        setMode("signin");
        setPassword("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Packaging Inventory
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to manage film rolls and granules stock.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "signin" ? "Staff sign in" : "Create staff account"}
            </CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Use your staff credentials to access both inventory modules."
                : "New staff accounts are recorded against every entry they make."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              {mode === "signup" ? (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Rahim Uddin"
                    disabled={submitting}
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="staff@example.com"
                  disabled={submitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signin" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  disabled={submitting}
                  required
                />
              </div>

              {error ? (
                <Alert variant="destructive" role="alert">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {notice ? (
                <Alert role="status">
                  <AlertDescription>{notice}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Please wait…
                  </>
                ) : mode === "signin" ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  Need an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setNotice(null);
                    }}
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                      setNotice(null);
                    }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
