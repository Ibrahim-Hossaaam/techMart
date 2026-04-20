"use client";

import { Loader2, ShoppingCartIcon, Trash2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AddToCartResponse } from "@/interfaces/cart/AddToCartResponse";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import apiService from "../../../../services/api";
import CartProduct from "@/components/product/CartProduct";
import { toast } from "sonner";
import { cartContext } from "@/contexts/cartContext";



interface InnerCartProps {
  cart: AddToCartResponse;
  token: string;
}


export default function ShoppingCart({ cart, token }: InnerCartProps) {
  const [innerCartData, setInnerCartData] = useState<AddToCartResponse>(cart);
  const [isClearing, setIsClearing] = useState(false);
  const { setCartCount } = useContext(cartContext);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Address form state
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    setCartCount(innerCartData.numOfCartItems);
  }, [innerCartData, setCartCount]);


  async function removeItem(productId: string) {
    const res = await apiService.removeProductFromCart(productId, token);
    setInnerCartData(res);
    toast.success(res.message);
  }

  async function handlCheckout() {
    // Validate address fields
    if (!address.fullName || !address.email || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.postalCode || !address.country) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const res = await apiService.checkout(cart.cartId, token);

      toast.success("Proceeding to checkout...");
      location.href = res.session.url;
    } catch (error) {
      toast.error("Error processing checkout");
    } finally {
      setIsCheckoutLoading(false);
    }
  }
  async function clearCart() {
    setIsClearing(true);
    const res = await apiService.clearCart(token);
    toast.success("Cart cleared successfully");
    setInnerCartData(res);
    setIsClearing(false);
  }
  async function updateProductCount(productId: string, count: number) {
    const res = await apiService.updateProductCount(productId, count, token);
    setInnerCartData(res);
    toast.success("Cart updated successfully");
  }


  if (innerCartData.numOfCartItems === 0) {
    return (
      <section className="flex items-center justify-center min-h-screen">
        <div className="container max-w-lg text-center">
          <h1 className="mb-4 text-2xl font-semibold">Your cart is empty</h1>
          <p className="mb-8 text-muted-foreground">
            Looks like you haven't added anything yet.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="container grid gap-4">
        <h1 className="mb-8 text-3xl font-semibold">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items & Address */}
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {innerCartData.data.products.map((item) => (
                <CartProduct
                  removeItem={removeItem} item={item}
                  updateProductCount={updateProductCount}
                />
              ))}
            </div>

            {/* Address Form */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold">Delivery Address</h2>

              <form className="space-y-4">
                {/* Full Name & Email */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName" className="text-sm font-medium mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Address Line 1 */}
                <div>
                  <Label htmlFor="addressLine1" className="text-sm font-medium mb-2 block">
                    Street Address
                  </Label>
                  <Input
                    id="addressLine1"
                    placeholder="123 Main Street"
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <Label htmlFor="addressLine2" className="text-sm font-medium mb-2 block">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apt 4B"
                    value={address.addressLine2}
                    onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>

                {/* City, State, Postal Code */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium mb-2 block">
                      State/Province
                    </Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-sm font-medium mb-2 block">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="10001"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country" className="text-sm font-medium mb-2 block">
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="bg-secondary border-border"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <ShoppingCartIcon className="size-4" />
                    {innerCartData.numOfCartItems}{" "}
                    {innerCartData.numOfCartItems === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(0)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(innerCartData.data.totalCartPrice)}</span>
                </div>
              </div>

              <Button disabled={isCheckoutLoading} onClick={handlCheckout} size="lg" className="mt-6 w-full">
                {isCheckoutLoading && <Loader2 className="mr-2 animate-spin" />}{" "}
                Proceed to Checkout
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Taxes calculated at checkout
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={clearCart}
          disabled={isClearing}
          className="w-fit px-8 text-destructive border-destructive/50 hover:bg-destructive/10 disabled:cursor-not-allowed"
        >
          {isClearing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Clear Cart
        </Button>

      </div>
    </section>
  );
};


export { ShoppingCart };
