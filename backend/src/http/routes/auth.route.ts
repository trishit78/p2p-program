import express, { type Request, type Response } from 'express';
import { getUserByIdHandler, signInHandler, signUpHandler } from '../controller/auth.controller.js';
import { authRequest } from '../middleware/auth.middleware.js';
import { signUpValidation, signInValidation, getUserByIdValidation } from '../middleware/validation.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signUpHandler);

authRouter.post('/signin', signInValidation, signInHandler);

authRouter.get('/:id', authRequest, getUserByIdValidation, getUserByIdHandler);

export default authRouter