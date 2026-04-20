"use client";

import { MenuIcon, ShoppingCart, Zap } from "lucide-react";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cartContext } from "@/contexts/cartContext";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  className?: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const session = useSession();
  const router = useRouter();
  const { cartCount } = useContext(cartContext);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 glass border-b border-primary/20",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <nav className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg gradient-primary glow">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              <span className="text-gradient">Nexa</span>
              <span className="text-foreground">Shop</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link
                  href="/products"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                >
                  Products
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/categories"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                >
                  Categories
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/brands"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                >
                  Brands
                </Link>
              </NavigationMenuItem>

              {session.status === "authenticated" && (
                <>
                  <NavigationMenuItem>
                    <Link
                      href="/cart"
                      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10 flex items-center gap-1"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                      {cartCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground border-0">
                          {cartCount}
                        </Badge>
                      )}
                    </Link>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link
                      href="/orders"
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                    >
                      Orders
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            {session.status === "unauthenticated" ? (
              <>
                <Button
                  onClick={() => router.push("/auth/signin")}
                  variant="ghost"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => router.push("/auth/signup")}
                  className="gradient-primary text-white border-0 glow hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="ghost"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                Sign out
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="glass border-primary/20 w-72">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg gradient-primary">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
                      <span className="text-gradient">Nexa</span>
                      <span className="text-foreground">Shop</span>
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-4 mt-4 gap-2">
                {[
                  { href: "/products", label: "Products" },
                  { href: "/categories", label: "Categories" },
                  { href: "/brands", label: "Brands" },
                  ...(session.status === "authenticated"
                    ? [
                        { href: "/cart", label: "Cart" },
                        { href: "/orders", label: "Orders" },
                      ]
                    : []),
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  >
                    {link.label}
                    {link.href === "/cart" && cartCount > 0 && (
                      <Badge className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground border-0">
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                ))}

                <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                  {session.status === "unauthenticated" ? (
                    <>
                      <Button
                        onClick={() => router.push("/auth/signin")}
                        variant="ghost"
                        className="w-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        Sign in
                      </Button>
                      <Button
                        onClick={() => router.push("/auth/signup")}
                        className="w-full gradient-primary text-white border-0"
                      >
                        Get Started
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      Sign out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;