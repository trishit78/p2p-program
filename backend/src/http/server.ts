import express from "express";

import cors from "cors";
import apiRouter from "./routes/apiRoutes.js";
import liveKitRouter from "./routes/livekit.route.js";
import authRouter from "./routes/auth.route.js";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", apiRouter);
app.use("/livekit",liveKitRouter);
app.use("/auth",authRouter);
export default app;