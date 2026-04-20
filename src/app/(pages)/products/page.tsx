"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "@/redux/slices/productSlice";
import { ProductCard } from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import { SlidersHorizontal, Package } from "lucide-react";


export default function Products() {
  const dispatch = useDispatch<any>();
  const { products, loading } = useSelector((state: any) => state.product);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border bg-card/50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              All Products
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            {loading
              ? "Loading products..."
              : `${products.length} products available`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">Check back later for new arrivals.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {products.map((product: any, i: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
              >
                <ProductCard
                  name={product.title}
                  images={product.images}
                  rating={product.ratingsAverage}
                  reviewCount={product.ratingsQuantity}
                  price={product.price}
                  originalPrice={product.price + 200}
                  id={product._id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}