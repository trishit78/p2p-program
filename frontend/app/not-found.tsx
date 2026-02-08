"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";

export default function NotFound() {
  return (
    <AuthLayout
      icon={<AlertTriangle className="w-6 h-6 text-white dark:text-black" />}
      title="404"
      subtitle="Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      badges={["Lost?", "No worries", "Go back"]}
      codePreview={{
        fileName: "error.js",
        comment: "Page not found",
        variableName: "error",
        variables: [
          { name: "status", value: "404" },
          { name: "message", value: "not found" },
        ],
        functionName: "handleError",
        functionLines: [
          "console.error('Page not found')",
          "redirect('/')",
        ],
        statusText: "Ready to navigate home",
        statusReady: true,
      }}
    >
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold">Page Not Found</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            This page doesn&apos;t exist or you may have mistyped the URL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                The requested resource could not be located on this server.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-medium transition-colors">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go to Homepage
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
