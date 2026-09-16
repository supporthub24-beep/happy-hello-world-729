import { useState } from "react";
import { Flame, Mail, Timer, Zap } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

const perks = [
  { icon: Zap, label: "প্রথম অর্ডারে ১০% ছাড়" },
  { icon: Timer, label: "নতুন জাত সবার আগে" },
  { icon: Flame, label: "সাবস্ক্রাইবার-অনলি ক্রেট" },
];

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-mango to-mango-deep p-8 text-primary-foreground shadow-[0_20px_60px_-15px_rgba(255,140,0,0.6)] md:p-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-secondary/30 blur-3xl"
            />

            <div className="relative grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-sm">
                  <Flame className="size-3.5" aria-hidden="true" />
                  সীমিত সময়ের অফার
                </span>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight drop-shadow-sm md:text-4xl">
                  প্রথম অর্ডারে ১০% ছাড় — এখনই নিন
                </h2>
                <p className="mt-3 max-w-md text-sm font-medium text-primary-foreground/90">
                  হারভেস্ট লিস্টে যোগ দিন এবং প্রতিটি জাতের আগাম অ্যাক্সেস, মৌসুমি রেসিপি ও
                  সাবস্ক্রাইবার-অনলি ক্রেট পান — স্টক শেষ হওয়ার আগেই।
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {perks.map((p) => (
                    <span
                      key={p.label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-sm"
                    >
                      <p.icon className="size-4" aria-hidden="true" />
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email) return;
                  toast.success("আপনি লিস্টে যোগ হয়েছেন! কোডের জন্য ইনবক্স চেক করুন।");
                  setEmail("");
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    ইমেইল ঠিকানা
                  </label>
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="w-full rounded-full border-0 bg-card py-3.5 pl-11 pr-4 text-sm text-foreground outline-none ring-offset-2 focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-sm font-bold text-secondary-foreground shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                >
                  ছাড় নিন
                  <Flame
                    className="size-4 transition-transform group-hover:scale-110"
                    aria-hidden="true"
                  />
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
