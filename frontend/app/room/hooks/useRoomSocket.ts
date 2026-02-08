import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Question, SubmissionResult } from "@/lib/types";

interface UseRoomSocketOptions {
  roomId: string;
  onUserJoined?: () => void;
}

interface UseRoomSocketReturn {
  socket: WebSocket | null;
  users: string[];
  question: Question | null;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  submissionResult: SubmissionResult | null;
  setSubmissionResult: React.Dispatch<React.SetStateAction<SubmissionResult | null>>;
  openFeedback: boolean;
  setOpenFeedback: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useRoomSocket({
  roomId,
  onUserJoined,
}: UseRoomSocketOptions): UseRoomSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [openFeedback, setOpenFeedback] = useState<boolean>(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/${roomId}`);
    
    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "USER_LIST":
          setUsers(data.users);
          break;
        case "USER_JOINED":
          setUsers((prevUsers) => [...prevUsers, data.userName]);
          toast.success(`${data.userName} joined`);
          onUserJoined?.();
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
  }, [roomId, onUserJoined]);

  return {
    socket,
    users,
    question,
    setQuestion,
    submissionResult,
    setSubmissionResult,
    openFeedback,
    setOpenFeedback,
  };
}
