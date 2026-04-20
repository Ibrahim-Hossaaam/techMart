"use client";

import { useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import apiService from "../../../services/api";
import { toast } from "sonner";
import { cartContext } from "@/contexts/cartContext";


export interface ProductCardProps {
  name?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  isNew?: boolean;
  discount?: number;
  id: string;
}
export function ProductCard({
  name = "Premium Product",
  price = 89.99,
  originalPrice = 129.99,
  rating = 4.8,
  reviewCount = 142,
  images = ["/logo.svg"],
  isNew = false,
  id,
}: ProductCardProps) {
  const session = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const { setCartCount } = useContext(cartContext);

  const safeImages = images && images.length > 0 ? images : ["/logo.svg"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (isAddedToCart) return;
    if (!session.data?.user) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    setIsAddingToCart(true);
    const token = session.data?.user?.token as string;
    const res = await apiService.addProductToCart(id, token);

    if (res.status === "success") {
      toast.success(res.message);
      setCartCount(res.numOfCartItems);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    } else {
      toast.error(res.message || "Failed to add to cart");
    }
    setIsAddingToCart(false);
  }

  const discountPercent =
    originalPrice && originalPrice > (price ?? 0)
      ? Math.round(((originalPrice - (price ?? 0)) / originalPrice) * 100)
      : 0;

  return (
    <Card className="group relative p-0 w-full overflow-hidden bg-card border-border hover:border-primary/40 transition-all duration-300 card-hover rounded-xl">
      {/* Image Area */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted/30">
        <motion.img
          key={currentImageIndex}
          src={safeImages[currentImageIndex]}
          alt={name}
          className="object-cover w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Nav arrows */}
        {safeImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="h-7 w-7 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={nextImage}
              className="h-7 w-7 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Image dots */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {safeImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-1 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "bg-primary w-4"
                    : "bg-white/40 w-1.5"
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <Badge className="bg-destructive text-white border-0 text-xs px-1.5 py-0.5">
              -{discountPercent}%
            </Badge>
          )}
          {isNew && (
            <Badge className="bg-primary text-white border-0 text-xs px-1.5 py-0.5">
              New
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2 right-2 h-7 w-7 rounded-full glass flex items-center justify-center transition-all ${
            isWishlisted ? "text-rose-500" : "text-white/70 hover:text-rose-400"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <CardContent className="p-3">
        <div className="space-y-1.5">
          <Link href={`/products/${id}`} className="block">
            <h3 className="text-sm font-medium line-clamp-2 leading-snug hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-xs font-medium">{rating?.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">
              {formatPrice(price ?? 0)}
            </span>
            {originalPrice && originalPrice > (price ?? 0) && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-3 pt-0">
        <Button
          className={`w-full h-9 text-xs font-medium transition-all ${
            isAddedToCart
              ? "bg-emerald-600 hover:bg-emerald-700 text-white border-0"
              : "gradient-primary text-white border-0 hover:opacity-90"
          }`}
          onClick={handleAddToCart}
          disabled={isAddingToCart || isAddedToCart}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Adding...
            </>
          ) : isAddedToCart ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
