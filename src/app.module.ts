import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ResourcesModule } from './blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BlogEntity } from './blog/blog.entity';
import { UserEntity } from './user/user.entity';
import { ChatModule } from './chats/chats.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { TransformInterceptor } from './user/trasnform.iterceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [BlogEntity, UserEntity],
      synchronize: true,
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        isGlobal: true,
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }),
    }),
    UserModule,
    ResourcesModule,
    AuthModule,
    ChatModule,
  ],
  providers: [TransformInterceptor],
})
export class AppModule {}
