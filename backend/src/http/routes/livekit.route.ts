import express, {type Request,type Response } from 'express';
import { AccessToken } from 'livekit-server-sdk';
import { serverConfig } from '../../config/index.js';
import { getLivekitTokenValidation } from '../middleware/validation.middleware.js';

const liveKitRouter = express.Router()

const createToken = async (roomName:string,participantName:string) => {
  // If this room doesn't exist, it'll be automatically created when the first
  // participant joins
  // Identifier to be used for participant.
  // It's available as LocalParticipant.identity with livekit-client SDK

  const at = new AccessToken(serverConfig.LIVEKIT_API_KEY,serverConfig.LIVEKIT_API_SECRET, {
    identity: participantName,
    // Token to expire after 10 minutes
    ttl: '10m',
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return await at.toJwt();
};


liveKitRouter.get('/getToken', getLivekitTokenValidation, async (req:Request, res:Response) => {
  const { roomName, userName } = req.query;
  const token = await createToken(roomName as string, userName as string);
  res.status(200).json({token});
});

export default liveKitRouter;