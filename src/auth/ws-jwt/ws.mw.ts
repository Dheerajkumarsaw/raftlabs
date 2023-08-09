import { Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt.guard';
import { ForbiddenException } from '@nestjs/common';

export type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export const SocketAuthMiddleWare = (): SocketIOMiddleWare => {
  return async (client, next) => {
    try {
      await WsJwtGuard.validateToken(client);
      next();
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      next(error);
    }
  };
};
