/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { use, useEffect, useMemo, useState } from "react";
import {
  Users,
  Play,
  RotateCcw,
  Settings,
  Copy,
  CheckCircle,
  Clock,
  User,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/theme-switcher";
import { toast } from "sonner";
import { getDifficultyColor, getInitials } from "@/lib/utils";
import { Question, SubmissionResult } from "@/lib/types";
import useSound from "use-sound";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import SubmissionModal from "@/components/SubmissionModal";
import { AuthLayout } from "@/components/AuthLayout";

// Dynamic imports for heavy client-only components
const Editor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    ),
  }
);

const LiveKitComponent = dynamic(
  () => import("@/components/Livekit"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    ),
  }
);





export default function RoomIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userName, setUserName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState<string[]>([]);
  // const [code, setCode] = useState("// Start coding...");
  const [token, setToken] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [openFeedback, setOpenFeedback] = useState<boolean>(false);
  const [playSound] = useSound("/join.mp3");
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [editor, setEditor] = useState<any>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [binding, setBinding] = useState<MonacoBinding | null>(null);
  const [isYjsConnected, setIsYjsConnected] = useState(false);

  useEffect(() => {
    if (!id) return;
    const yjsProvider = new WebsocketProvider(
      "ws://localhost:8000",
      `yjs-${id}`,
      ydoc,
      {
        connect: true,
      }
    );
    yjsProvider.on("status", (event: any) => {
      console.log("Yjs status:", event.status);
      setIsYjsConnected(event.status === "connected");
    });

    yjsProvider.on("connection-close", () => {
      console.log("Yjs connection closed");
      setIsYjsConnected(false);
    });

    yjsProvider.on("sync", (isSynced: boolean) => {
      console.log("Yjs synced:", isSynced);
    });

    setProvider(yjsProvider);

    return () => {
      yjsProvider?.destroy();
    };
  }, [id, ydoc]);
  useEffect(() => {
    if (!provider || !editor || !ydoc) {
      return;
    }

    console.log("Setting up Monaco binding...");

    const ytext = ydoc.getText("monaco");
    const model = editor.getModel();

    if (!model) {
      console.error("Monaco model not available");
      return;
    }

    const monacoBinding = new MonacoBinding(
      ytext,
      model,
      new Set([editor]),
      provider.awareness
    );

    setBinding(monacoBinding);

    if (ytext.length === 0) {
      ytext.insert(0, "// Start coding...");
    }

    return () => {
      monacoBinding?.destroy();
    };
  }, [ydoc, provider, editor]);
  useEffect(() => {
    return () => {
      binding?.destroy();
      provider?.destroy();
      ydoc?.destroy();
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/${id}`);
    ws.onopen = () => {
      console.log("WebSocket connected");
     // console.log(api.ws);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "USER_LIST":
          setUsers(data.users);
          break;
        // case "CODE_UPDATE":
        //   if (data.code !== code) {
        //     setCode(data.code);
        //   }
        //   break;
        case "USER_JOINED":
          setUsers((prevUsers) => [...prevUsers, data.userName]);
          toast.success(`${data.userName} joined`);
          playSound();
          break;
        case "QUESTION_UPDATE":
          setQuestion(data.question);
          break;
        case "SOLUTION_REVIEW":
          setSubmissionResult(data.solution);
          setOpenFeedback(true);
          break;
        default:
          break;
      }
    };
    ws.onclose = () => {
      console.log(" WebSocket closed");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [id]);
  const handleJoin = async () => {
    if (socket && userName.trim()) {
      socket.send(
        JSON.stringify({
          type: "JOIN_ROOM",
          roomId: id,
          userName,
        })
      );
    }
    const res = await fetch(
      `http://localhost:8000/livekit/getToken?roomName=${id}&userName=${userName.trim()}`
    );
    const data = await res.json();
    setToken(data.token);
    setJoined(true);
    playSound();
  };

  async function setNewQuestion() {
    setLoadingQuestion(true);
    try {
      const res = await fetch(`http://localhost:8000/api/chat/question`);
      const response = await res.json();

      if (response.success) {
        const newQuestion = response.data;
        setQuestion(newQuestion);

        socket?.send(
          JSON.stringify({
            type: "QUESTION_CHANGE",
            roomId: id,
            question: newQuestion,
          })
        );

        toast.success("New question generated!");
      } else {
        toast.error("Failed to generate question");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      toast.error("Failed to fetch question");
    } finally {
      setLoadingQuestion(false);
    }
  }
  async function handleSubmit() {
    if (!question) {
      toast.error("No question loaded to submit!");
      return;
    }

    try {
      toast.loading("Submitting solution for review...", { id: "submit" });
      const currentCode = ydoc.getText("monaco").toString();
      const res = await fetch(`http://localhost:8000/api/chat/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.description,
          solution: currentCode,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Solution reviewed!", { id: "submit" });

        setSubmissionResult(data.data);
        setOpenFeedback(true);
        socket?.send(
          JSON.stringify({
            type: "SOLUTION_REVIEW",
            solution: data.data,
            roomId: id,
          })
        );
      } else {
        toast.error("Failed to review solution", { id: "submit" });
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
      toast.error("Error while submitting", { id: "submit" });
    }
  }

  if (!joined) {
    return (
      <AuthLayout
        icon={<Users className="w-6 h-6 text-white dark:text-black" />}
        title="Join"
        subtitle="Room"
        description="Enter your username to join the collaborative coding session."
        badges={[`Room: ${id}`, "Real-time Sync", "Video Chat"]}
        codePreview={{
          fileName: `${id}.session`,
          comment: "Collaborative coding session",
          variableName: "session",
          variables: [
            { name: "room", value: id },
            { name: "user", value: userName || "awaiting..." },
            { name: "status", value: userName ? "ready" : "pending", type: "status" },
          ],
          functionName: "joinSession",
          functionLines: [
            "await connect(room)",
            "// Start collaborating...",
          ],
          statusText: userName ? "Ready to join" : "Enter username above",
          statusReady: !!userName,
        }}
      >
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold">
              Enter Session
            </CardTitle>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Choose a username to identify yourself
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleJoin()}
                  className="h-11 border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white transition-colors"
                />
              </div>

              <Button
                onClick={handleJoin}
                disabled={!userName.trim()}
                className="w-full h-11 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  Join Room
                  <Play className="w-4 h-4" />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Room: {id}</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {users.length} online
            </Badge>
            <ModeToggle />
          </div>

          <div className="flex items-center gap-2">
            {users.slice(0, 6).map((user, i) => (
              <div key={i} className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                {i < 3 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    {user}
                  </span>
                )}
              </div>
            ))}
            {users.length > 6 && (
              <Badge variant="outline" className="ml-2">
                +{users.length - 6}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {token && (
        <div className="h-[280px] border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
          <div className="h-full">
            <LiveKitComponent token={token} height="100%" />
          </div>
        </div>
      )}
      {!token && (
        <div className="h-[280px] border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            Connecting to video...
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {question ? question.title : "No Question Loaded"}
                </h2>
                <div className="flex items-center gap-2">
                  {question && (
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    onClick={setNewQuestion}
                    disabled={loadingQuestion}
                  >
                    {loadingQuestion ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {loadingQuestion ? "Loading..." : "Set New Question"}
                  </Button>
                </div>
              </div>
              {question && (
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Question loaded
                  </div>
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-6">
              {question ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {question.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Example 1:</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                      <div>
                        <strong>Input:</strong> {question.exampleInputFirst}
                      </div>
                      <div>
                        <strong>Output:</strong> {question.exampleOutputFirst}
                      </div>
                    </div>
                  </div>

                  {question.exampleInputSecond &&
                    question.exampleOutputSecond && (
                      <div>
                        <h3 className="font-semibold mb-3">Example 2:</h3>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                          <div>
                            <strong>Input:</strong>{" "}
                            {question.exampleInputSecond}
                          </div>
                          <div>
                            <strong>Output:</strong>{" "}
                            {question.exampleOutputSecond}
                          </div>
                        </div>
                      </div>
                    )}

                  <div>
                    <h3 className="font-semibold mb-3">Constraints:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {question.constraints.map((constraint, index) => (
                        <li key={index}>
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                            {constraint}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No question loaded yet
                  </p>
                  <Button onClick={setNewQuestion} disabled={loadingQuestion}>
                    {loadingQuestion ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {loadingQuestion ? "Loading..." : "Load First Question"}
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-gray-50 dark:bg-gray-900">
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm">
                  <option>JavaScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>C++</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              // value={code}
              // onChange={handleCodeChange}
              onMount={(editor) => {
                setEditor(editor);
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
              }}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                Last saved: just now
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-1" />
                  Run Code
                </Button>
                <Button size="sm" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
          <div>
            <SubmissionModal
              feedbackData={submissionResult}
              openFeedback={openFeedback}
              setOpenFeedback={setOpenFeedback}
            />
          </div>
        </div>
      </div>
    </div>
  );
}