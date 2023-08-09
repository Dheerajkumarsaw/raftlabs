import {
  CanActivate,
  Injectable,
  ExecutionContext,
  Logger,
  BadGatewayException,
  ForbiddenException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    WsJwtGuard.validateToken(client);
    return true;
  }

  static verifyTokenAsync(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          reject({
            error: err,
            message: 'Invalid signature, You are not authorized',
          });
        } else {
          resolve(decoded);
        }
      });
    });
  }

  static async validateToken(client: Socket) {
    const { authorization } = client.handshake.headers;
    Logger.log('Token received', { authorization });
    if (!authorization) {
      throw new BadGatewayException(
        'Token must be present,Login and get the token',
      );
    }
    const token: string = authorization.split(' ')[1];
    const payload = await this.verifyTokenAsync(token);
    return payload;
  }
}
