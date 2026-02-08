"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { signin } from "@/lib/api";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    if (!formData.email || !formData.email.includes("@"))
      return "Please enter a valid email";
    if (!formData.password || formData.password.length < 1)
      return "Please enter your password";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) return setErr(v);

    setIsLoading(true);

    try {
      const response = await signin({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        document.cookie = `token=${response.data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }

      router.push("/");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome"
      subtitle="Back"
      description="Sign in to your account and continue your collaborative coding journey."
      badges={["Infinite Rooms", "Lightening Fast", "AI Powered"]}
      codePreview={{
        fileName: "session.js",
        comment: "Resume your session",
        variableName: "session",
        variables: [
          { name: "user", value: formData.email || "awaiting..." },
          { name: "authenticated", value: formData.email && formData.password ? "true" : "false", type: "boolean" },
          { name: "status", value: formData.email ? "ready" : "pending", type: "status" },
        ],
        functionName: "authenticate",
        functionLines: [
          "await verifyCredentials()",
          "// Welcome back, developer!",
        ],
        statusText: formData.email ? "Ready to authenticate" : "Enter your credentials",
        statusReady: !!formData.email,
      }}
    >
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="h-11 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="h-11 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {err && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{err}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-medium transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-black dark:text-white font-medium hover:underline"
              >
                Create one
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}