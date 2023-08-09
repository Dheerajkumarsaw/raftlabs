import { UseGuards, Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt/ws-jwt.guard';
import { SocketAuthMiddleWare } from 'src/auth/ws-jwt/ws.mw';

@WebSocketGateway({ namespace: 'events' })
@UseGuards(WsJwtGuard)
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`${client.id} connection created`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`${client.id} disconnected`);
  }

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleWare() as any);
  }

  @SubscribeMessage('message')
  sendMessage(@MessageBody() body: any) {
    this.logger.log(body);
    this.server.emit('newMessage', body);
  }
}
