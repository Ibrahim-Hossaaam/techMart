"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  Minus,
  Plus,
  Loader2,
} from "lucide-react";
import { Product } from "@/interfaces/Product";
import apiService from "../../../services/api";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const session = useSession();
  const allImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageCover];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [Isloading, setIsLoading] = useState(false);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const prev = () => {
    const newIdx = (currentIndex - 1 + allImages.length) % allImages.length;
    setDirection(-1);
    setCurrentIndex(newIdx);
  };

  const next = () => {
    const newIdx = (currentIndex + 1) % allImages.length;
    setDirection(1);
    setCurrentIndex(newIdx);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      return (
        <span key={i} className="relative inline-block">
          <Star className="h-4 w-4 text-muted-foreground/30" />
          {(filled || half) && (
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: half ? "50%" : "100%" }}
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            </span>
          )}
        </span>
      );
    });
  };
  async function addToCart() {
    setIsLoading(true);
    const token = session.data?.user?.token as string;
    const res = await apiService.addProductToCart(product._id, token);

    setIsLoading(false);
    console.log(res);

    if (res.status === "success") {
      toast.success(res.message, {
        style: { color: "green" },
      });
    } else {
      toast.error(res.message || "Failed to add to cart");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Left + Right layout */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* ── IMAGE COLUMN ── */}
        <div className="w-full md:w-[45%] flex flex-col gap-4">
          {/* Main image with arrows */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/30 border border-border group">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={currentIndex}
                src={allImages[currentIndex]}
                alt={`${product.title} – image ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain p-4"
                custom={direction}
                variants={{
                  enter: (d: number) => ({
                    x: d > 0 ? 60 : -60,
                    opacity: 0,
                  }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({
                    x: d > 0 ? -60 : 60,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
            </AnimatePresence>

            {/* Nav arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border shadow flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur border border-border shadow flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 justify-center flex-wrap">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === currentIndex
                      ? "border-primary shadow-sm scale-105"
                      : "border-border hover:border-primary/50"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── INFO COLUMN ── */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Title + Wishlist */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
            <button
              onClick={() => setIsWishlisted((p) => !p)}
              className={`flex-shrink-0 h-9 w-9 rounded-full border border-border flex items-center justify-center transition-colors ${isWishlisted
                  ? "text-rose-500 border-rose-200 bg-rose-50"
                  : "text-muted-foreground hover:text-rose-500"
                }`}
              aria-label="Add to wishlist"
            >
              <Heart
                className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`}
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(product.ratingsAverage)}
            </div>
            <span className="text-sm font-medium">
              {product.ratingsAverage?.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({product.ratingsQuantity} reviews)
            </span>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
            {product.quantity > 0 ? (
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-200 bg-emerald-50 text-xs font-medium"
              >
                In stock
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs font-medium">
                Out of stock
              </Badge>
            )}
          </div>

          <Separator />

          {/* Tabs: Description / Details / Shipping */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid grid-cols-3 bg-transparent p-0 h-auto border-b border-border rounded-none gap-0 w-full">
              {["description", "details", "shipping"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent pb-2 text-sm font-medium capitalize text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-colors"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="pt-4 text-sm text-muted-foreground leading-relaxed">
              {product.description ||
                "No description available for this product."}
            </TabsContent>

            <TabsContent value="details" className="pt-4">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {product.category && (
                  <>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{product.category.name}</dd>
                  </>
                )}
                {product.brand && (
                  <>
                    <dt className="text-muted-foreground">Brand</dt>
                    <dd className="font-medium">{product.brand.name}</dd>
                  </>
                )}
                {product.sold !== undefined && (
                  <>
                    <dt className="text-muted-foreground">Units Sold</dt>
                    <dd className="font-medium">{product.sold}</dd>
                  </>
                )}
                {product.quantity !== undefined && (
                  <>
                    <dt className="text-muted-foreground">In Stock</dt>
                    <dd className="font-medium">{product.quantity} units</dd>
                  </>
                )}
              </dl>
            </TabsContent>

            <TabsContent value="shipping" className="pt-4 text-sm text-muted-foreground leading-relaxed">
              <ul className="space-y-2">
                <li>🚚 Standard delivery: 3-5 business days</li>
                <li>⚡ Express delivery: 1-2 business days (additional fee)</li>
                <li>🔄 Free returns within 30 days</li>
                <li>📦 Ships from our warehouse in 24 hours</li>
              </ul>
            </TabsContent>
          </Tabs>

          <Separator />

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            {/* Quantity stepper */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.quantity ?? 99, q + 1))
                }
                className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Add to cart */}
            <Button
              onClick={addToCart}
              className="disabled:bg-indigo-400 flex-1 h-10 gap-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold"
              disabled={Isloading}
            >
              {Isloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />
              }              Add to cart
            </Button>
          </div>

          {/* Buy now */}
          <Button
            variant="outline"
            className="w-full h-10 font-semibold border-border hover:bg-muted"
            disabled={product.quantity === 0}
          >
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}
