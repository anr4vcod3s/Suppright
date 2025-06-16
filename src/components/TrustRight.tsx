// src/components/WhyTrustSuppRight.tsx
import { Search, Scale, ShieldCheck } from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const words = "How SuppRight Works";
export const WhyTrustSuppRight = () => {
  return (
    <section className="w-full py-24 bg-background sm:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <TextGenerateEffect words={words} />
          <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
            A simple, transparent process you can trust.
          </p>
        </div>

        <div className="mt-24 grid grid-cols-1 justify-center justify-items-center gap-12 md:grid-cols-3">
          {/* --- Card 1: Search --- */}
          <MagicCard
            className="rounded-2xl bg-card border border-border"
            gradientColor="hsl(var(--card))"
            gradientFrom="#3b82f6"
            gradientTo="#8b5cf6"
            gradientSize={200}
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold text-card-foreground">
                Search & Select
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Choose any supplements you&apos;re curious about from our extensive
                database of products available in India.
              </p>
            </div>
          </MagicCard>

          {/* --- Card 2: Compare --- */}
          <MagicCard
            className="rounded-2xl bg-card border border-border"
            gradientColor="hsl(var(--card))"
            gradientFrom="#3b82f6"
            gradientTo="#8b5cf6"
            gradientSize={200}
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold text-card-foreground">
                See the Facts
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything side-by-side in one simple table: prices, macros,
                ingredients, and more.
              </p>
            </div>
          </MagicCard>

          {/* --- Card 3: Choose --- */}
          <MagicCard
            className="rounded-2xl bg-card border border-border"
            gradientColor="hsl(var(--card))"
            gradientFrom="#3b82f6"
            gradientTo="#8b5cf6"
            gradientSize={200}
          >
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold text-card-foreground">
                Choose with Confidence
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Objective data to find the right supplement for you to make a
                decision you feel good about.
              </p>
            </div>
          </MagicCard>
        </div>
      </div>
    </section>
  );
};