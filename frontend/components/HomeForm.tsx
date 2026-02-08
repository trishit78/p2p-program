"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Hash, ArrowRight, Terminal } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";

export default function HomeForm() {
  const router = useRouter();
  const [room, setRoom] = useState("");
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    if (!room || room.trim().length < 2)
      return "Room name must be at least 2 characters";
    if (room.indexOf(" ") >= 0) {
      return "No spaces in the room name";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const v = validate();
    if (v) return setErr(v);

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push(`/room/${room}`);
  }

  return (
    <AuthLayout
      icon={<Terminal className="w-6 h-6 text-white dark:text-black" />}
      title="Code"
      subtitle="Together"
      description="Real-time collaborative coding environment. Join a room and start coding together."
      badges={["Infinite Rooms", "Lightening Fast", "AI Powered"]}
      codePreview={{
        fileName: `${room || "room"}.js`,
        comment: `Room: ${room || "waiting..."}`,
        variableName: "room",
        variables: [
          { name: "name", value: room || "my-room" },
          { name: "user", value: "developer" },
        ],
        functionName: "startSession",
        functionLines: [
          'console.log(`Connected to ${room}`)',
          "Ready to code...",
        ],
        statusText: room ? "Ready to join" : "Enter details above",
        statusReady: !!room,
      }}
    >
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-semibold">Join Room</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            Enter room details to start collaborating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="room"
                className="flex items-center gap-2 text-sm font-medium"
              >
                <Hash className="w-4 h-4" />
                Room Name
              </Label>
              <Input
                id="room"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="frontend-interview"
                className="h-11 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-colors"
              />
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
                  Joining...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Join Room
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
