"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertTriangle, Terminal } from "lucide-react";

interface CodeOutputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    status: string;
    output?: string;
    compileError?: string;
    runtimeError?: string;
  } | null;
  title?: string;
}

export function CodeOutputModal({
  open,
  onOpenChange,
  result,
  title = "Code Output",
}: CodeOutputModalProps) {
  if (!result) return null;

  const isAccepted = result.status === "Accepted";
  const hasError = result.compileError || result.runtimeError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              isAccepted
                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
            }`}
          >
            {isAccepted ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <span
              className={`font-medium ${
                isAccepted
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              Status: {result.status}
            </span>
          </div>

          {/* Output */}
          {result.output && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </label>
              <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap max-h-40">
                {result.output}
              </pre>
            </div>
          )}

          {/* Compile Error */}
          {result.compileError && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <label className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Compile Error
                </label>
              </div>
              <pre className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap max-h-40 text-amber-800 dark:text-amber-200">
                {result.compileError}
              </pre>
            </div>
          )}

          {/* Runtime Error */}
          {result.runtimeError && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <label className="text-sm font-medium text-red-700 dark:text-red-300">
                  Runtime Error
                </label>
              </div>
              <pre className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre-wrap max-h-40 text-red-800 dark:text-red-200">
                {result.runtimeError}
              </pre>
            </div>
          )}

          {/* No output message */}
          {!result.output && !hasError && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No output produced.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
