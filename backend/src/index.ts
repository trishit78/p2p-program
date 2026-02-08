import http from 'http';
import { serverConfig } from './config/index.js';
import { setupWebSocket } from './ws/socket.js';
import app from './http/server.js';
import { connectDB } from './config/db.js';


const PORT=serverConfig.PORT;
const server = http.createServer(app);

setupWebSocket(server);
server.listen(PORT,async()=>{
    await connectDB()
    console.log(`server is running pn port ${PORT}`)
   // console.log("🔥 Server process PID:", process.pid);

})