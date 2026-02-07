import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    GEMINI_KEY:string,
    LIVEKIT_API_SECRET:string,
    LIVEKIT_API_KEY:string    
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
    LIVEKIT_API_SECRET:process.env.LIVEKIT_API_SECRET || ''
};