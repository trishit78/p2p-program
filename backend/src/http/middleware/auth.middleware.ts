import type { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../service/auth.service.js";


export const authRequest = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const authHeader =req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer')){
            res.status(401).json({
                success:false,
                message:"Invalid auth header"
            })
        };
        
        
        const token = authHeader?.split(" ")[1];
        
        if(!token){
            throw new Error("Bearer Token is missing")
        }
        
        if(typeof token !== "string"){
            res.status(401).json({
                success:false,
                message:"Missing or Invalid access token"
            })
        }
        
        const response =await isAuthenticated(token);
        if(!response){
            res.status(401).json({
                success:false,
                message:'Unauthorized'
            })
        };

        req.user ={id:response};
        next();


    } catch (error) {
        if(error instanceof Error){
            res.status(401).json({
                success:false,
                message:'Unauthorized',
                data:error.message
            })
        }
    }
}