import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ChatGateway } from 'src/chats/chats.gateway';
import { TransformInterceptor } from './trasnform.iterceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 5,
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ChatGateway,
    TransformInterceptor,
  ],
  exports: [CacheModule],
})
export class UserModule {}
