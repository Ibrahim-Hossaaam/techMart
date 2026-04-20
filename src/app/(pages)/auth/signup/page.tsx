"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, Phone, Zap } from "lucide-react";
import apiService from "@services/api";

export default function Signup() {
  const form = useForm();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  async function onSubmit(data: any) {
    if (data.password !== data.rePassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiService.signup(
        data.name,
        data.email,
        data.password,
        data.rePassword,
        data.phone
      );
      if (res.message === "success") {
        toast.success("Account created! Please sign in.");
        router.push("/auth/signin");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    "bg-secondary border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus-visible:ring-primary/30 h-11 pl-10";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(0.62 0.19 264)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10 blur-3xl"
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
            Create your account
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Join thousands of happy customers
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("name", { required: true })}
                placeholder="Full name"
                type="text"
                className={inputClass}
                id="signup-name"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("email", { required: true })}
                placeholder="Email address"
                type="email"
                autoComplete="email"
                className={inputClass}
                id="signup-email"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("phone")}
                placeholder="Phone number (optional)"
                type="tel"
                className={inputClass}
                id="signup-phone"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("password", { required: true })}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className={inputClass + " pr-10"}
                id="signup-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...form.register("rePassword", { required: true })}
                placeholder="Confirm password"
                type={showConfirm ? "text" : "password"}
                className={inputClass + " pr-10"}
                id="signup-confirm-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 gradient-primary text-white border-0 glow hover:opacity-90 transition-opacity font-semibold"
              id="signup-submit"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
