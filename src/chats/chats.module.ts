import { Module } from '@nestjs/common';
import { ChatGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ChatGateway],
})
export class ChatModule {}
