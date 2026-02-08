import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    GEMINI_KEY:string,
    LIVEKIT_API_SECRET:string,
    LIVEKIT_API_KEY:string,
    OPENAI_API_KEY:string ,
    MONGO_URI:string,
    JWT_SECRET:string,
    JWT_EXPIRY:string,
    JUDGE0_API_KEY:string  
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    GEMINI_KEY:process.env.GEMINI_KEY!,
    LIVEKIT_API_KEY:process.env.LIVEKIT_API_KEY || '',
    LIVEKIT_API_SECRET:process.env.LIVEKIT_API_SECRET || '',
    OPENAI_API_KEY:process.env.OPENAI_API_KEY || '',
    MONGO_URI:process.env.MONGO_URI || '',
    JWT_EXPIRY:process.env.JWT_EXPIRY || '7d',
    JWT_SECRET:process.env.JWT_SECRET ||'trishit',
    JUDGE0_API_KEY:process.env.JUDGE0_API_KEY||''
};