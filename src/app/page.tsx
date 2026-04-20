"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/slices/productSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Headphones,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $50",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure transactions",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Round-the-clock assistance",
  },
];

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const featured = products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: "oklch(0.62 0.19 264)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ background: "oklch(0.72 0.18 55)" }} />

        <div className="container mx-auto max-w-7xl relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-primary/30 bg-primary/10 text-primary mb-6">
                <TrendingUp className="h-3 w-3" />
                New Arrivals Every Week
              </span>
              <h1
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Shop the{" "}
                <span className="text-gradient">Future</span>{" "}
                of Tech
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
                Discover cutting-edge electronics, premium gadgets, and the latest tech innovations — all in one place with unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="gradient-primary text-white border-0 glow hover:opacity-90 transition-opacity px-8 h-12"
                >
                  <Link href="/products">
                    Explore Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border hover:border-primary/50 hover:bg-primary/10 hover:text-primary px-8 h-12"
                >
                  <Link href="/categories">
                    Browse Categories
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 grid grid-cols-3 gap-8"
            >
              {[
                { value: "10K+", label: "Products" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-gradient" style={{ fontFamily: "Sora, sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border bg-card/50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Hand Picked
                </span>
              </div>
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Featured Products
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-primary hover:bg-primary/10 gap-1"
            >
              <Link href="/products">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-card border border-border animate-pulse"
                >
                  <div className="aspect-[3/4] bg-muted rounded-t-xl" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-8 bg-muted rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.map((product: any) => (
                <ProductCard
                  key={product._id}
                  name={product.title}
                  images={product.images}
                  rating={product.ratingsAverage}
                  reviewCount={product.ratingsQuantity}
                  price={product.price}
                  originalPrice={product.price + 200}
                  id={product._id}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white blur-2xl" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
                    Limited Time Offer
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  Up to 40% Off
                </h2>
                <p className="text-white/70 text-lg">
                  On selected premium tech products this week
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 shrink-0"
              >
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
