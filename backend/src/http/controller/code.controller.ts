import type { Request, Response } from "express";
import { questions } from "../../questions/question.js";
import { pollResult, submitToJudge0 } from "../service/judge0.service.js";
import { normalize } from "../../utils/normalize.js";
import { Submission } from "../model/submission.model.js";
import { wrapJavaScriptCode } from "../templates/template.js";


const LANGUAGE_MAP: Record<string, any> = {
  javascript: 63,
  cpp: 54,
  python: 71
};

export const codeRunHandler = async(req:Request,res:Response)=>{
const { code, language, questionId } = req.body;

  const q = questions[questionId];
  if (!q) return res.status(400).json({ error: "Invalid question" });

  const test = q.testCases[0];

    const finalCode = wrapJavaScriptCode(
    code,
    test.input
  );


  const token = await submitToJudge0(
    finalCode,
    LANGUAGE_MAP[language],
    test.input
  );

  const result = await pollResult(token);

  const output = result.stdout || "";
  const passed =
    normalize(output) === normalize(test.output);

  res.json({
    status: result.status.description,
    output,
    expected: test.output,
    passed,
    compileError: result.compile_output,
    runtimeError: result.stderr
  });
}


export const submissionHandler = async(req:Request,res:Response)=>{
     const { code, language, questionId, userId } = req.body;
  const q = questions[questionId];

  let verdict = "Accepted";

  for (const tc of q.testCases) {
     const finalCode = wrapJavaScriptCode(code, tc.input);

    const token = await submitToJudge0(
      finalCode,
      63,
      tc.input
    );

    const result = await pollResult(token);
    const output = result.stdout || "";

    if (normalize(output) !== normalize(tc.output)) {
      verdict = "Wrong Answer";
      break;
    }
  }

  await Submission.create({
    userId,
    questionId,
    language:"javascript",
    code,
    verdict
  });

  res.json({ verdict });
}