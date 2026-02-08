import express, { type Request, type Response } from 'express';
import { getUserByIdHandler, signInHandler, signUpHandler } from '../controller/auth.controller.js';
import { authRequest } from '../middleware/auth.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup',signUpHandler);

authRouter.post('/signin',signInHandler);

authRouter.get('/:id',authRequest,getUserByIdHandler);

export default authRouter