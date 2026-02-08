import axios, { AxiosError } from "axios";
import { Question, SubmissionResult } from "./types";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token from cookies
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper function to handle errors uniformly
function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    throw new Error(error.response?.data?.message || "Request failed");
  }
  throw error;
}

// Auth API types
interface SigninData {
  email: string;
  password: string;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface SigninResponse {
  success: boolean;
  data: {
    token: string;
  };
}

interface SignupResponse {
  success: boolean;
  message: string;
}

interface QuestionResponse {
  success: boolean;
  data: Question;
}

interface SubmitSolutionData {
  question: string;
  solution: string;
}

interface SubmitSolutionResponse {
  success: boolean;
  data: SubmissionResult;
}

interface LivekitTokenResponse {
  token: string;
}

interface RunCodeData {
  code: string;
  language: string;
  input: string;
  expectedOutput: string;
}

export interface RunCodeResponse {
  status: string;
  output: string;
  expected: string;
  passed: boolean;
  compileError?: string;
  runtimeError?: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface SubmitCodeData {
  code: string;
  language: string;
  input: string;
}

export interface SubmitCodeResponse {
  status: string;
  output: string;
  compileError?: string;
  runtimeError?: string;
}

// Auth API functions
export async function signin(data: SigninData): Promise<SigninResponse> {
  try {
    const response = await api.post<SigninResponse>("/auth/signin", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function signup(data: SignupData): Promise<SignupResponse> {
  try {
    const response = await api.post<SignupResponse>("/auth/signup", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

// Question API functions
export async function getQuestion(): Promise<QuestionResponse> {
  try {
    const response = await api.get<QuestionResponse>("/api/chat/question");
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function submitSolution(data: SubmitSolutionData): Promise<SubmitSolutionResponse> {
  try {
    const response = await api.post<SubmitSolutionResponse>("/api/chat/answer", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getLivekitToken(roomName: string, userName: string): Promise<LivekitTokenResponse> {
  try {
    const response = await api.get<LivekitTokenResponse>("/livekit/getToken", {
      params: { roomName, userName },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function runCode(data: RunCodeData): Promise<RunCodeResponse> {
  try {
    const response = await api.post<RunCodeResponse>("/code/run", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function submitCode(data: SubmitCodeData): Promise<SubmitCodeResponse> {
  try {
    const response = await api.post<SubmitCodeResponse>("/code/submit", data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export default api;
