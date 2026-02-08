import axios from "axios";
import { JUDGE0_HEADERS, JUDGE0_URL } from "../../config/judge0.js";


export const submitToJudge0 = async (
  source_code: string,
  language_id: number,
  stdin: string
) => {
  const res = await axios.post(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
    { source_code, language_id, stdin },
    { headers: JUDGE0_HEADERS }
  );

  return res.data.token;
};

export const pollResult = async (token: string) => {
  for (let i = 0; i < 10; i++) {
    const res = await axios.get(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      { headers: JUDGE0_HEADERS }
    );

    const statusId = res.data.status.id;

    if (statusId >= 3) return res.data;

    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error("Judge0 timeout");
};
