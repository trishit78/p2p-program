
import jwt from 'jsonwebtoken'
import type { UserDataDTO, UserSigninDTO } from '../../types/user.js';
import { comparePassword, createToken, hashPassword } from '../../utils/auth.js';
import { serverConfig } from '../../config/index.js';
import { getUserByEmail, getUserById, getUserByIdRepo, signUpRepo } from '../repository/auth.repo.js';



export const signUpService = async(userData:UserDataDTO)=>{
    try {
        const userPassword = userData.password;
        const hashedPassword = await hashPassword(userPassword);
        const user = await signUpRepo({
            username:userData.username,
            email:userData.email,
            password:hashedPassword,

        });
        if(!user){
            throw new Error('cannot create the user')
        }
        return user;
    } catch (error) {
        if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in service layer');
        }
            
    }
}


export const signInService = async(userData:UserSigninDTO)=>{
    try {
        const userDetails = await getUserByEmail(userData);
        if(!userDetails){
            throw new Error('no user records found');
        }
        const response = comparePassword(userData.password,userDetails.password);
        if(!response){
            throw new Error('Wrong Password..');
        }

        const token  = createToken({id:userDetails._id.toString(),email:userDetails.email});

        return {userDetails,token}
    } catch (error) {
        if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in sign up endpoint in service layer');
        }
            
    }  
}


export async function isAuthenticated(token:string){
    try {
        if(!token){
            throw new Error('missing jwt token');
        }

        const response = jwt.verify(token,serverConfig.JWT_SECRET);
        
        if(!response){
            throw new Error('Invalid token in payload');
        }

        const user = await getUserById((response as any).id);
     
        
        if(!user){
            throw new Error('No user found');
        }

        return user._id



    } catch (error:unknown) {
        if(error instanceof Error){
            if(error.name == 'JsonWebTokenError'){
                throw new Error('Invalid JWT Token');
            }
            if(error.name == 'TokenExpiredError'){
                throw new Error('JWT token expired');
            }
            throw error;
        }
        throw new Error('Internal server error in auth middleware')
    }
}


export async function getUserByIdService(id:string) {
    try {
        const user = await getUserByIdRepo(id);
        return user;
     } catch (error) {
        if(error instanceof Error){
            console.log(error)
            throw new Error('error occured in get user by id endpoint in service layer');
        }
            
    } 
}

