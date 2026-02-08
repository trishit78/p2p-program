import mongoose from 'mongoose'
import { serverConfig } from './index.js';


export async function connectDB() {
    try{
        
        await mongoose.connect(serverConfig.MONGO_URI);


        mongoose.connection.on("error",(err)=>{
            console.error("MongoDB connection error",err);
        });

        mongoose.connection.on("disconnected",(err)=>{
            console.error("MongoDB disconnected");
        });

        process.on("SIGINT",async ()=>{
            await mongoose.connection.close();
            console.info("mongoDB connection closed");
            process.exit(0);  
        })

        console.log("monogdb connected");
    }catch(error){
        console.log(error)
        process.exit(1)   
    }
}