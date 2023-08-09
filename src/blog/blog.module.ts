import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { UserEntity } from 'src/user/user.entity';
import { ChatGateway } from 'src/chats/chats.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity])],
  controllers: [BlogController],
  providers: [BlogService, ChatGateway],
})
export class ResourcesModule {}
