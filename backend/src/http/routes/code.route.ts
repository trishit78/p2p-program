import express, { type Request, type Response } from 'express';
import { authRequest } from '../middleware/auth.middleware.js';
import { codeRunHandler, submissionHandler } from '../controller/code.controller.js';

const codeRouter = express.Router();


codeRouter.post('/run',authRequest,codeRunHandler);
codeRouter.post('/submit',authRequest,submissionHandler);

export default codeRouter;