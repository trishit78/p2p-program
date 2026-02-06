import express, { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';


const apiRouter = express.Router();

apiRouter.get("/test",(req:Request,res:Response)=>{
    res.status(StatusCodes.OK).json({message:"This is a test route"});
})

export default apiRouter;