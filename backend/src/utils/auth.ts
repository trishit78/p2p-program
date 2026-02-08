import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'; 
import type { inputDataDTO } from "../types/user.js";
import { serverConfig } from "../config/index.js";



export async function hashPassword(userpassword:string){
    return await bcrypt.hash(userpassword,10);
}


export function comparePassword(userPassword:string,encryptedPassword:string){
    return bcrypt.compare(userPassword,encryptedPassword);
}

export function createToken(inputData:inputDataDTO){
    return jwt.sign(inputData, serverConfig.JWT_SECRET as string, {expiresIn:'7d'})
}