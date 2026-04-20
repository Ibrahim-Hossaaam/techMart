"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Zap } from "lucide-react";

export default function Signin() {
  const form = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  async function onSubmit(data: any) {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.ok) {
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    } else {
      setIsLoading(false);
      toast.error("Invalid email or password");
    }
  }

  const inputClass =
    "bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary/30 h-11 pl-10";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.62 0.19 264)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.72 0.18 55)" }}
      />

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-primary/20">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center justify-center h-9 w-9 rounded-xl gradient-primary glow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>
              <span className="text-gradient">Nexa</span>
              <span className="text-foreground">Shop</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Sora, sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("email", { required: true })}
                placeholder="Email address"
                type="email"
                autoComplete="email"
                className={inputClass}
                id="signin-email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("password", { required: true })}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={inputClass + " pr-10"}
                id="signin-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 gradient-primary text-white border-0 glow hover:opacity-90 transition-opacity font-semibold"
              id="signin-submit"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
