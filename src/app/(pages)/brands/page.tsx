import React, { Suspense } from "react";
import apiService from "../../../../services/api";
import Link from "next/link";
import { Award, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

function BrandsLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Animated gradient circle */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl animate-pulse" />
          <div className="relative h-20 w-20 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Brands</h2>
          <p className="text-muted-foreground">Fetching premium brands for you...</p>
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

async function BrandsContent() {
  let brands: any[] = [];
  try {
    brands = await apiService.getBrands();
  } catch (e) {
    brands = [];
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Top Brands
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Discover {brands.length} world-class brands in our store
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No brands found</h2>
            <p className="text-muted-foreground">Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {brands.map((brand: any) => (
              <Link
                key={brand._id}
                href={`/products?brand=${brand._id}`}
                className="group relative rounded-2xl bg-card border border-border hover:border-primary/40 p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/10 card-hover"
              >
                {/* Brand logo */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-sm group-hover:shadow-primary/20 transition-shadow">
                  {brand.image ? (
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </h2>
                </div>

                {/* Hover indicator */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:text-primary">
                  <span>View products</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {brands.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Can't find your brand? Explore all products instead.
            </p>
            <Button
              asChild
              className="gradient-primary text-white border-0 hover:opacity-90 glow"
            >
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Brands() {
  return (
    <Suspense fallback={<BrandsLoadingFallback />}>
      <BrandsContent />
    </Suspense>
  );
}
