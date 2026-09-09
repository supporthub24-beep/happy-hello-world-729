 import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="rounded-[2rem] bg-gradient-to-br from-mango to-mango-deep p-8 text-primary-foreground md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  Get 10% off your first order
                </h2>
                <p className="mt-3 max-w-md text-sm text-primary-foreground/80">
                  Join the harvest list for early access to each variety, seasonal recipes and
                  subscriber-only crates.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!email) return;
                  toast.success("You're on the list! Check your inbox for the code.");
                  setEmail("");
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
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
                  className="rounded-full bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Claim discount
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}