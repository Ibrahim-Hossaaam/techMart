import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { redirect } from "next/navigation";
import { ShoppingBag, Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function OrdersLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        {/* Animated order cards */}
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 w-80 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading Orders</h2>
          <p className="text-muted-foreground">Retrieving your order history...</p>
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

interface OrderItem {
  product: {
    title: string;
    imageCover: string;
    _id: string;
  };
  count: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethodType: string;
  createdAt: string;
  cartItems: OrderItem[];
  shippingAddress?: {
    city?: string;
    details?: string;
    phone?: string;
  };
}

async function getDecodedToken() {
  const cookieStore = await cookies();
  const encodedToken =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (!encodedToken) return null;

  const decodedToken = await decode({
    token: encodedToken,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "",
  });

  return decodedToken;
}

async function getAllOrders(userId: string, token: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_Base_Url}/api/v1/orders/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token as string,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return (data as Order[]) || [];
  } catch {
    return [];
  }
}

const statusConfig = {
  paid_delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  paid_pending: {
    label: "Processing",
    icon: Truck,
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
  },
  unpaid: {
    label: "Pending Payment",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
};

async function AllOrdersContent() {
  const decoded = await getDecodedToken();
  if (!decoded) redirect("/auth/signin");

  const userId = decoded.id as string;
  const token = decoded.token as string;

  const orders = await getAllOrders(userId, token);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-primary" />
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              My Orders
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            {orders.length > 0
              ? `You have ${orders.length} order${orders.length > 1 ? "s" : ""}`
              : "No orders yet"}
          </p>
        </div>
      </div>

      {/* Orders */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Looks like you haven&apos;t made any purchases yet. Start shopping to see your orders here.
            </p>
            <Button asChild className="gradient-primary text-white border-0 glow hover:opacity-90">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const statusKey =
                order.isPaid && order.isDelivered
                  ? "paid_delivered"
                  : order.isPaid
                    ? "paid_pending"
                    : "unpaid";
              const status = statusConfig[statusKey];
              const StatusIcon = status.icon;
              const orderDate = new Date(order.createdAt).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              );

              return (
                <div
                  key={order._id}
                  className="rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/30 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{orderDate}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">
                          {formatPrice(order.totalOrderPrice)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                          {order.paymentMethodType}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${status.bg} ${status.color}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    <div className="flex flex-col gap-3">
                      {order.cartItems.slice(0, 3).map((item) => (
                        <div key={item._id} className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                              src={item.product.imageCover}
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-1">
                              {item.product.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.count}x · {formatPrice(item.price)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold shrink-0">
                            {formatPrice(item.price * item.count)}
                          </span>
                        </div>
                      ))}
                      {order.cartItems.length > 3 && (
                        <p className="text-xs text-muted-foreground pt-1">
                          +{order.cartItems.length - 3} more item{order.cartItems.length - 3 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Shipping */}
                  {order.shippingAddress && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <Truck className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                        <span>
                          {[
                            order.shippingAddress.city,
                            order.shippingAddress.details,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllOrders() {
  return (
    <Suspense fallback={<OrdersLoadingFallback />}>
      <AllOrdersContent />
    </Suspense>
  );
}
