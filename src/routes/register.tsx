import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LogIn,
  ShieldCheck,
  UserPlus,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "রেজিস্টার — ইনভেন্টরি ম্যানেজার" },
      {
        name: "description",
        content:
          "নতুন স্টাফ অ্যাকাউন্ট তৈরি করুন — নাম, ইমেইল ও পাসওয়ার্ড দিয়ে রেজিস্টার করে ইনভেন্টরি ম্যানেজমেন্ট সিস্টেমে প্রবেশ করুন।",
      },
      { property: "og:title", content: "রেজিস্টার — ইনভেন্টরি ম্যানেজার" },
      {
        property: "og:description",
        content:
          "Supabase-ভিত্তিক ইনভেন্টরি ম্যানেজমেন্ট সিস্টেমে নতুন স্টাফ অ্যাকাউন্ট তৈরি করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const navigate = useNavigate();
  const { user, loading, configured, signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/dashboard" });
    }
  }, [loading, user, navigate]);

  function validate(): boolean {
    const errors: typeof fieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "পূর্ণ নাম লিখুন।";
    } else if (fullName.trim().length < 3) {
      errors.fullName = "নাম কমপক্ষে ৩ অক্ষরের হতে হবে।";
    }

    if (!email.trim()) {
      errors.email = "ইমেইল লিখুন।";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "সঠিক ইমেইল ঠিকানা লিখুন।";
    }

    if (!password) {
      errors.password = "পাসওয়ার্ড লিখুন।";
    } else if (password.length < 6) {
      errors.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "পাসওয়ার্ড আবার লিখুন।";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "দুইটি পাসওয়ার্ড মিলছে না।";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    if (!validate()) return;

    setBusy(true);
    const { error } = await signUp(email.trim(), password, fullName.trim());
    setBusy(false);

    if (error) {
      setFormError(error);
      return;
    }

    setNotice(
      "অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল ভেরিফিকেশন চালু থাকলে ইনবক্স কনফার্ম করে লগইন করুন।",
    );
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFieldErrors({});
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border/60 bg-card/40">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Warehouse className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              ইনভেন্টরি ম্যানেজার
            </span>
          </Link>
          <Button asChild size="sm" variant="ghost">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              হোম
            </Link>
          </Button>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              স্টাফ রেজিস্ট্রেশন
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              নাম, ইমেইল ও পাসওয়ার্ড দিয়ে নতুন স্টাফ অ্যাকাউন্ট তৈরি করুন। প্রতিটি এন্ট্রিতে
              আপনার নাম স্বয়ংক্রিয়ভাবে রেকর্ড হবে।
            </p>
          </div>

          {!configured ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Supabase কনফিগার করা নেই</AlertTitle>
              <AlertDescription>
                <code className="font-mono text-xs">VITE_SUPABASE_URL</code> এবং{" "}
                <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> এনভায়রনমেন্ট
                ভেরিয়েবল সেট করার পর অ্যাপটি পুনরায় চালু করুন।
              </AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">নতুন অ্যাকাউন্ট</CardTitle>
              <CardDescription>
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                  লগইন করুন
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="register-name">পূর্ণ নাম</Label>
                  <Input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="স্টাফের নাম"
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    aria-describedby={fieldErrors.fullName ? "register-name-error" : undefined}
                  />
                  {fieldErrors.fullName ? (
                    <p id="register-name-error" className="text-xs text-destructive">
                      {fieldErrors.fullName}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">ইমেইল</Label>
                  <Input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="staff@example.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
                  />
                  {fieldErrors.email ? (
                    <p id="register-email-error" className="text-xs text-destructive">
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">পাসওয়ার্ড</Label>
                  <Input
                    id="register-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? "register-password-error" : undefined
                    }
                  />
                  {fieldErrors.password ? (
                    <p id="register-password-error" className="text-xs text-destructive">
                      {fieldErrors.password}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">কনফার্ম পাসওয়ার্ড</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                    aria-invalid={Boolean(fieldErrors.confirmPassword)}
                    aria-describedby={
                      fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined
                    }
                  />
                  {fieldErrors.confirmPassword ? (
                    <p id="register-confirm-password-error" className="text-xs text-destructive">
                      {fieldErrors.confirmPassword}
                    </p>
                  ) : null}
                </div>

                {formError ? (
                  <Alert variant="destructive">
                    <AlertTitle>রেজিস্ট্রেশন ব্যর্থ</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                ) : null}

                {notice ? (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <AlertTitle>সফল</AlertTitle>
                    <AlertDescription>{notice}</AlertDescription>
                  </Alert>
                ) : null}

                <Button type="submit" className="w-full" disabled={busy || !configured}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                  )}
                  অ্যাকাউন্ট তৈরি করুন
                </Button>
              </form>

              <div className="mt-6 border-t border-border/60 pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                    লগইন পেজে যান
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            স্টাফ অ্যাকাউন্ট ২–৩ জনের জন্য অনুমোদিত। অ্যাকাউন্ট তৈরি করতে সমস্যা হলে অ্যাডমিনের
            সাথে যোগাযোগ করুন।
          </p>
        </div>
      </main>
    </div>
  );
}
