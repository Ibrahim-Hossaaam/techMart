import React, { Suspense } from "react";
import apiService from "../../../../services/api";
import Link from "next/link";
import { Tag, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

function CategoriesLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Animated stacked cards */}
        <div className="relative w-32 h-32">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                transform: `translateY(${i * 8}px) scale(${1 - i * 0.1})`,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Categories</h2>
          <p className="text-muted-foreground">Finding amazing categories for you...</p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}

async function CategoriesContent() {
  let categories: any[] = [];
  try {
    categories = await apiService.getCategories();
  } catch (e) {
    categories = [];
  }

  // Color palette for category cards
  const gradients = [
    "from-violet-600/20 to-indigo-600/20 border-violet-500/30 hover:border-violet-500/60",
    "from-blue-600/20 to-cyan-600/20 border-blue-500/30 hover:border-blue-500/60",
    "from-emerald-600/20 to-teal-600/20 border-emerald-500/30 hover:border-emerald-500/60",
    "from-orange-600/20 to-amber-600/20 border-orange-500/30 hover:border-orange-500/60",
    "from-rose-600/20 to-pink-600/20 border-rose-500/30 hover:border-rose-500/60",
    "from-purple-600/20 to-fuchsia-600/20 border-purple-500/30 hover:border-purple-500/60",
    "from-sky-600/20 to-blue-600/20 border-sky-500/30 hover:border-sky-500/60",
    "from-lime-600/20 to-green-600/20 border-lime-500/30 hover:border-lime-500/60",
  ];

  const iconColors = [
    "text-violet-400",
    "text-blue-400",
    "text-emerald-400",
    "text-orange-400",
    "text-rose-400",
    "text-purple-400",
    "text-sky-400",
    "text-lime-400",
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Shop by Category
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Browse {categories.length} categories and find exactly what you need
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No categories found</h2>
            <p className="text-muted-foreground">Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {categories.map((cat: any, i: number) => {
              const gradient = gradients[i % gradients.length];
              const iconColor = iconColors[i % iconColors.length];
              return (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat._id}`}
                  className={`group relative rounded-2xl bg-gradient-to-br ${gradient} border p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10`}
                >
                  {/* Category image */}
                  {cat.image && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!cat.image && (
                    <div className={`w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center`}>
                      <Tag className={`h-7 w-7 ${iconColor}`} />
                    </div>
                  )}

                  <div>
                    <h2 className="font-semibold text-foreground text-sm leading-tight">
                      {cat.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    Explore
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {categories.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Looking for something specific?
            </p>
            <Button
              asChild
              className="gradient-primary text-white border-0 hover:opacity-90 glow"
            >
              <Link href="/products">
                Browse All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Categories() {
  return (
    <Suspense fallback={<CategoriesLoadingFallback />}>
      <CategoriesContent />
    </Suspense>
  );
}
