import { serverConfig } from "./index.js";

export const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
export const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Key": serverConfig.JUDGE0_API_KEY,
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
};
