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
import { Mail, Lock, ArrowRight, Terminal, Eye, EyeOff } from "lucide-react";
import { ModeToggle } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";

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
      const response = await fetch("http://localhost:8000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign in failed");
      }

      // Store token if returned
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
      }

      // Redirect to home after successful signin
      router.push("/");
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-foreground flex flex-col items-center justify-center px-6 py-12 relative">
      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className={cn(
          "mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
      <div className="absolute top-6 right-6 z-10">
        <ModeToggle />
      </div>

      <section className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  Welcome
                  <br />
                  <span className="text-gray-500">Back</span>
                </h1>
              </div>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-light">
              Sign in to your account and continue your collaborative coding
              journey.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <div className="border p-1 rounded-lg">Infinite Rooms</div>
            </div>
            <div>
              <div className="border p-1 rounded-lg">Lightening Fast</div>
            </div>
            <div>
              <div className="border p-1 rounded-lg">AI Powered</div>
            </div>
          </div>

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
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {err}
                    </p>
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
        </div>

        <div className="relative hidden lg:block">
          <div className="relative bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                  session.js
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="p-6 font-mono text-sm space-y-3">
              <div className="text-gray-500 dark:text-gray-500">
                // Resume your session
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

              <div className="space-y-2">
                <div>
                  <span className="text-gray-800 dark:text-gray-200">
                    const
                  </span>{" "}
                  <span className="text-black dark:text-white font-semibold">
                    session
                  </span>{" "}
                  <span className="text-gray-500">=</span>{" "}
                  <span className="text-gray-500">{"{"}</span>
                </div>
                <div className="ml-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    user:
                  </span>{" "}
                  <span className="text-green-600 dark:text-green-400">
                    &quot;{formData.email || "awaiting..."}&quot;
                  </span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    authenticated:
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {formData.email && formData.password ? "true" : "false"}
                  </span>
                  <span className="text-gray-500">,</span>
                </div>
                <div className="ml-4">
                  <span className="text-gray-600 dark:text-gray-400">
                    status:
                  </span>{" "}
                  <span className="text-yellow-600 dark:text-yellow-400">
                    &quot;{formData.email ? "ready" : "pending"}&quot;
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">{"}"}</span>
                </div>

                <div className="pt-4">
                  <div className="text-gray-800 dark:text-gray-200">
                    <span className="text-gray-800 dark:text-gray-200">
                      async function
                    </span>{" "}
                    <span className="text-black dark:text-white font-semibold">
                      authenticate
                    </span>
                    <span className="text-gray-500">() {"{"}</span>
                  </div>
                  <div className="ml-4 text-gray-600 dark:text-gray-400">
                    await verifyCredentials()
                  </div>
                  <div className="ml-4 text-gray-600 dark:text-gray-400">
                    // Welcome back, developer!
                  </div>
                  <div className="text-gray-500">{"}"}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formData.email ? "Ready to authenticate" : "Enter your credentials"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}