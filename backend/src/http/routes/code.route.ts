import express, { type Request, type Response } from 'express';
import { authRequest } from '../middleware/auth.middleware.js';
import { codeRunHandler, submissionHandler } from '../controller/code.controller.js';
import { codeRunValidation, submissionValidation } from '../middleware/validation.middleware.js';

const codeRouter = express.Router();

codeRouter.post('/run', codeRunValidation, codeRunHandler);
codeRouter.post('/submit', authRequest, submissionValidation, submissionHandler);

export default codeRouter;