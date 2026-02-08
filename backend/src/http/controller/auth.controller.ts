import type { Request, Response } from "express";
import { getUserByIdService, signInService, signUpService } from "../service/auth.service.js";

export const signUpHandler = async(req:Request,res:Response)=>{
    try {
        const response = await signUpService(req.body);
        res.status(200).json({
            success:true,
            message:'User signed up successfully',
            data:response
        })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({
                success:false,
                message:"Internal Server Error",
                data:error.message
            })
        }
    }
}

export const signInHandler = async(req:Request,res:Response)=>{
    try {
        const response = await signInService(req.body);
        res.status(200).json({
            success:true,
            message:'User signed in successfully',
            data:response
        })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({
                success:false,
                message:"Internal Server Error",
                data:error.message
            })
        }
    }
}

export const getUserByIdHandler = async(req:Request,res:Response)=>{
     try {
        const id = String(req.params.id)
        const response = await getUserByIdService(id);
        res.status(200).json({
            success:true,
            message:'User fetched successfully',
            data:response
        })
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({
                success:false,
                message:"Internal Server Error",
                data:error.message
            })
        }
    }
}