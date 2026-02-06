import { GoogleGenAI, Type } from '@google/genai';
import express, { type Request, type Response } from 'express';
import {  StatusCodes } from 'http-status-codes';
import { serverConfig } from '../../config/index.js';


const apiRouter = express.Router();
const ai = new GoogleGenAI({
    apiKey:serverConfig.GEMINI_KEY
})

apiRouter.get("/test",(req:Request,res:Response)=>{
    res.status(StatusCodes.OK).json({message:"This is a test route"});
})

apiRouter.post("/chat/question",async(req:Request,res:Response)=>{
    try {
        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:"You are an AI coding question generator. Give a JavaScript coding question with a title, description, difficulty (Easy/Medium/Hard), example input/output, and constraints. Format it exactly as requested in the schema.",
            config:{
                responseMimeType:"application/json",
                responseSchema:{
                    type:Type.OBJECT,
                    properties:{
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        difficulty: { type: Type.STRING },
                        exampleInput: { type: Type.STRING },
                        exampleOutput: { type: Type.STRING },
                        constraints: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING }
                        }
                    },
                    propertyOrdering: [
                        "title",
                        "description",
                        "difficulty",
                        "exampleInput",
                        "exampleOutput",
                        "constraints"
                      ]
                }
            }
        })
        const questionData = JSON.parse(response.text!);
        res.status(StatusCodes.ACCEPTED).json({
            success:true,
            message:"the question is prepared",
            data:questionData
        })
    } catch (error) {
        console.error("Error generating coding question: ",error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            error:"Failed to generate question"
        })
    }
})





export default apiRouter;