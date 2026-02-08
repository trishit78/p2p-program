import express, { type Request, type Response } from 'express';
import {  StatusCodes } from 'http-status-codes';
import { serverConfig } from '../../config/index.js';
import OpenAI from "openai";
import { answerValidation } from '../middleware/validation.middleware.js';


const apiRouter = express.Router();


const openai = new OpenAI({
  apiKey: serverConfig.OPENAI_API_KEY
});

apiRouter.get("/test",(req:Request,res:Response)=>{
    res.status(StatusCodes.OK).json({message:"This is a test route"});
})


apiRouter.get("/chat/question", async (req: Request, res: Response) => {
  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are an AI coding question generator.

Return ONLY valid JSON in the following exact structure:

{
  "title": string,
  "description": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "exampleInputFirst": string,
  "exampleOutputFirst": string,
  "exampleInputSecond": string,
  "exampleOutputSecond": string,
  "constraints": string[]
}

Do not add explanations. Do not wrap in markdown.
`,
    });

    const text = response.output_text;

    const questionData = JSON.parse(text);

    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: "the question is prepared",
      data: questionData,
    });
  } catch (error) {
    console.error("Error generating coding question:", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: "Failed to generate question",
    });
  }
});



apiRouter.post("/chat/answer", answerValidation, async (req: Request, res: Response) => {
    const { question, solution } = req.body;
  
    console.log("question", question);
    console.log("solution", solution);
  
    try {
      const prompt = `
  You are an experienced AI coding tutor.
  
  You will be given:
  1. A JavaScript coding question with title, description, difficulty, and example inputs/outputs.
  2. The student's submitted solution.
  
  Your task:
  - Compare the student's solution with what the question is asking.
  - Explain clearly what is correct, what needs improvement, and why.
  - Suggest optimizations and alternative approaches.
  - Keep the tone encouraging and educational.
  - Return the output in EXACTLY the following JSON format:
  {
    "title": "",
    "description": "",
    "analysis": "",
    "improvements": ""
  }
  
  You do NOT need to list or invent constraints.
  
  Question:
  ${question}
  
  Student's Solution:
  ${solution}
  `;
  
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", 
        messages: [
          { role: "system", content: "You are a helpful coding tutor." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });
  
      const text = response.choices[0]?.message?.content ?? "{}";
  
      let questionData;
      try {
        questionData = JSON.parse(text);
        console.log("question data", questionData);
      } catch (err) {
        console.error("Failed to parse OpenAI response:", err);
        return res.status(500).json({
          success: false,
          error: "Invalid AI response format",
        });
      }
  
      res.status(200).json({
        success: true,
        data: questionData,
      });
    } catch (error) {
      console.error("Error generating coding feedback:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate feedback",
      });
    }
  });
    
export default apiRouter;