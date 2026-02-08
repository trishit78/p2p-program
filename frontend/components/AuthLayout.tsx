"use client";

import React from "react";
import { Terminal, Users } from "lucide-react";
import { ModeToggle } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";

interface CodeVariable {
  name: string;
  value: string;
  type?: "string" | "boolean" | "status";
}

interface CodePreviewData {
  fileName: string;
  comment: string;
  variableName: string;
  variables: CodeVariable[];
  functionName: string;
  functionLines: string[];
  statusText: string;
  statusReady: boolean;
}

interface AuthLayoutProps {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  badges?: string[];
  children: React.ReactNode;
  
  codePreview?: CodePreviewData;
}

export function AuthLayout({
  icon,
  title,
  subtitle,
  description,
  badges = [],
  children,
  codePreview,
}: AuthLayoutProps) {
  const renderValue = (variable: CodeVariable) => {
    switch (variable.type) {
      case "boolean":
        return (
          <span className="text-blue-600 dark:text-blue-400">
            {variable.value}
          </span>
        );
      case "status":
        return (
          <span className="text-yellow-600 dark:text-yellow-400">
            &quot;{variable.value}&quot;
          </span>
        );
      default:
        return (
          <span className="text-green-600 dark:text-green-400">
            &quot;{variable.value}&quot;
          </span>
        );
    }
  };

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
                {icon || <Terminal className="w-6 h-6 text-white dark:text-black" />}
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  {title}
                  <br />
                  <span className="text-gray-500">{subtitle}</span>
                </h1>
              </div>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg font-light">
              {description}
            </p>
          </div>

          {badges.length > 0 && (
            <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              {badges.map((badge, index) => (
                <div key={index}>
                  <div className="border p-1 rounded-lg">{badge}</div>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>

        {codePreview && (
          <div className="relative hidden lg:block">
            <div className="relative bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                    {codePreview.fileName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 font-mono text-sm space-y-3">
                {/* Comment */}
                <div className="text-gray-500 dark:text-gray-500">
                  // {codePreview.comment}
                </div>
                
                {/* Divider */}
                <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

                {/* Code Block */}
                <div className="space-y-2">
                  {/* Variable declaration */}
                  <div>
                    <span className="text-gray-800 dark:text-gray-200">const</span>{" "}
                    <span className="text-black dark:text-white font-semibold">
                      {codePreview.variableName}
                    </span>{" "}
                    <span className="text-gray-500">=</span>{" "}
                    <span className="text-gray-500">{"{"}</span>
                  </div>

                  {/* Variables */}
                  {codePreview.variables.map((variable, index) => (
                    <div key={index} className="ml-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {variable.name}:
                      </span>{" "}
                      {renderValue(variable)}
                      {index < codePreview.variables.length - 1 && (
                        <span className="text-gray-500">,</span>
                      )}
                    </div>
                  ))}

                  <div>
                    <span className="text-gray-500">{"}"}</span>
                  </div>

                  {/* Function */}
                  <div className="pt-4">
                    <div className="text-gray-800 dark:text-gray-200">
                      <span className="text-gray-800 dark:text-gray-200">function</span>{" "}
                      <span className="text-black dark:text-white font-semibold">
                        {codePreview.functionName}
                      </span>
                      <span className="text-gray-500">() {"{"}</span>
                    </div>
                    {codePreview.functionLines.map((line, index) => (
                      <div key={index} className="ml-4 text-gray-600 dark:text-gray-400">
                        {line}
                      </div>
                    ))}
                    <span className="text-gray-500">{"}"}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {codePreview.statusReady ? codePreview.statusText : "Enter details above"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
