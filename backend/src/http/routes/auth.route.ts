import express from 'express';
import { signInHandler, signUpHandler } from '../controller/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/signup',signUpHandler);

authRouter.post('/signin',signInHandler);

export default authRouter