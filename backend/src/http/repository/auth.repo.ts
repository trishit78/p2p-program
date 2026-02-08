import mongoose from "mongoose";

import type { UserDataDTO, UserSigninDTO } from "../../types/user.js";
import { User } from "../model/user.model.js";

export const signUpRepo = async(userData:UserDataDTO)=>{
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
         if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in repo layer');
        }
    }
}

export const getUserByEmail = async(userData:UserSigninDTO)=>{
    try {
        const user = await User.findOne({
            email:userData.email
        });
        if(!user){
            throw new Error('No user found with the given email ID');
        }
        return user;
    } catch (error) {
         if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in repo layer');
        }
    }
}

export const getUserById = async(id:number)=>{
    try {
        const user = await User.findOne({
            _id:id
        });
         if(!user){
            throw new Error('No user found with the given ID');
        }
        return user;
     } catch (error) {
         if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in repo layer');
        }
    }
}

export const getUserByIdRepo = async(id:string)=>{
    try {
        const user = await User.findById(
         id
        );
         if(!user){
            throw new Error('No user found with the given ID');
        }
        return user?.username;
 } catch (error) {
         if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in repo layer');
        }
    }
}