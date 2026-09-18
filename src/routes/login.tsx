import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, LogIn, ShieldCheck, UserPlus, Warehouse } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "স্টাফ লগইন — ইনভেন্টরি ম্যানেজার" },
      {
        name: "description",
        content:
          "ফিল্ম রোল ও গ্রানুল স্টক ম্যানেজমেন্ট সিস্টেমে স্টাফ লগইন করুন। প্রতিটি এন্ট্রি অডিট ট্র্যাকিং সহ রেকর্ড হয়।",
      },
      { property: "og:title", content: "স্টাফ লগইন — ইনভেন্টরি ম্যানেজার" },
      {
        property: "og:description",
        content: "Supabase-ভিত্তিক ইনভেন্টরি ম্যানেজমেন্ট সিস্টেমে স্টাফ অ্যাকাউন্ট দিয়ে প্রবেশ করুন।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, configured, signIn, signUp } = useAuth();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInBusy, setSignInBusy] = useState(false);

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpNotice, setSignUpNotice] = useState<string | null>(null);
  const [signUpBusy, setSignUpBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/dashboard" });
    }
  }, [loading, user, navigate]);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignInError(null);
    setSignInBusy(true);
    const { error } = await signIn(signInEmail.trim(), signInPassword);
    setSignInBusy(false);
    if (error) {
      setSignInError(error);
      return;
    }
    void navigate({ to: "/dashboard" });
  }

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignUpError(null);
    setSignUpNotice(null);
    setSignUpBusy(true);
    const { error } = await signUp(signUpEmail.trim(), signUpPassword, signUpName.trim());
    setSignUpBusy(false);
    if (error) {
      setSignUpError(error);
      return;
    }
    setSignUpNotice(
      "অ্যাকাউন্ট তৈরি হয়েছে। ইমেইল ভেরিফিকেশন চালু থাকলে ইনবক্স কনফার্ম করে লগইন করুন।",
    );
    setSignUpName("");
    setSignUpEmail("");
    setSignUpPassword("");
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
              স্টাফ লগইন
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              অনুমোদিত ২–৩ জন স্টাফ অ্যাকাউন্ট দিয়ে প্রবেশ করুন। প্রতিটি এন্ট্রিতে আপনার নাম
              স্বয়ংক্রিয়ভাবে রেকর্ড হবে।
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
              <CardTitle className="font-display text-lg">অ্যাকাউন্ট অ্যাক্সেস</CardTitle>
              <CardDescription>
                লগইন করুন অথবা নতুন স্টাফ অ্যাকাউন্ট তৈরি করুন।
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">লগইন</TabsTrigger>
                  <TabsTrigger value="signup">সাইন আপ</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">ইমেইল</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={signInEmail}
                        onChange={(event) => setSignInEmail(event.target.value)}
                        placeholder="staff@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">পাসওয়ার্ড</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={signInPassword}
                        onChange={(event) => setSignInPassword(event.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    {signInError ? (
                      <Alert variant="destructive">
                        <AlertTitle>লগইন ব্যর্থ</AlertTitle>
                        <AlertDescription>{signInError}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Button type="submit" className="w-full" disabled={signInBusy || !configured}>
                      {signInBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <LogIn className="h-4 w-4" aria-hidden="true" />
                      )}
                      লগইন করুন
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">পূর্ণ নাম</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={signUpName}
                        onChange={(event) => setSignUpName(event.target.value)}
                        placeholder="স্টাফের নাম"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">ইমেইল</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={signUpEmail}
                        onChange={(event) => setSignUpEmail(event.target.value)}
                        placeholder="staff@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={6}
                        value={signUpPassword}
                        onChange={(event) => setSignUpPassword(event.target.value)}
                        placeholder="কমপক্ষে ৬ অক্ষর"
                      />
                    </div>

                    {signUpError ? (
                      <Alert variant="destructive">
                        <AlertTitle>সাইন আপ ব্যর্থ</AlertTitle>
                        <AlertDescription>{signUpError}</AlertDescription>
                      </Alert>
                    ) : null}

                    {signUpNotice ? (
                      <Alert>
                        <AlertTitle>সফল</AlertTitle>
                        <AlertDescription>{signUpNotice}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Button type="submit" className="w-full" disabled={signUpBusy || !configured}>
                      {signUpBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                      )}
                      অ্যাকাউন্ট তৈরি করুন
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
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
