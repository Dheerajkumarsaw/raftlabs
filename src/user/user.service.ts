import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { AuthService } from '../auth/auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ChatGateway } from 'src/chats/chats.gateway';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly chatGateway: ChatGateway,
  ) {}

  async createUserProfile(inputData: CreateUserDto): Promise<CreateUserDto> {
    this.logger.log('Create user route is called');
    const isUserExist = await this.userRepository.findOne({
      where: [
        { mobile: inputData.mobile },
        { email: inputData.email },
        { username: inputData.username },
      ],
    });
    if (isUserExist) {
      if (inputData.mobile === isUserExist.mobile) {
        this.logger.debug('Mobile no should be unique');
        this.chatGateway.sendMessage(
          `Hey! user clicked the create API to cerate new user was unsuccessful`,
        );
        throw new HttpException(
          'User different Mobile No, should be unique',
          HttpStatus.BAD_REQUEST,
        );
      } else if (isUserExist.email === inputData.email) {
        this.logger.debug('Email should be unique');
        this.chatGateway.sendMessage(
          `Hey! user clicked the create API to cerate new user was unsuccessful`,
        );
        throw new HttpException(
          'User different Email, should be unique',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        this.logger.debug('Username should be unique');
        this.chatGateway.sendMessage(
          `Hey! user clicked the create API to cerate new user was unsuccessful`,
        );
        throw new HttpException(
          'User different Username, should be unique',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const newUser = await this.userRepository.save({
      ...inputData,
      password: await this.authService.hashPassword(inputData.password),
    });
    this.logger.debug(`New user registered successfully ${newUser}`);
    const username = newUser.username;
    const cachedData = await this.cacheManager.set(
      `users${newUser.id}`,
      JSON.stringify(newUser),
      {
        ttl: 0,
      },
    );
    this.chatGateway.sendMessage(
      `Hey! one user create in the DB with id ${newUser.id} and successfully created`,
    );
    return newUser;
  }

  async getUserProfile(id: number, user: UserEntity): Promise<CreateUserDto> {
    this.logger.log('Get user route is called');
    const isUserInCache: string = await this.cacheManager.get(`users${id}`);
    if (isUserInCache) {
      this.chatGateway.sendMessage(
        `Hey! user clicked the get API to see his profile with id ${id}, and request was successful`,
      );
      return JSON.parse(isUserInCache);
    }
    if (id !== user.id) {
      this.logger.debug('Unauthorized to access the resource');
      throw new ForbiddenException('You are not authorized access the profile');
    }
    const dbUser = await this.userRepository.findOne({ where: { id: id } });
    if (!dbUser) {
      this.logger.debug(`User not found with id ${id}`);
      this.chatGateway.sendMessage(
        `Hey! user clicked the get API to see his profile with id ${id}, but request was unsuccessful`,
      );
      throw new HttpException(
        `User not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.logger.debug(`Found User with id ${id}`);
    this.chatGateway.sendMessage(
      `Hey! user clicked the get API to see his profile with id ${id}`,
    );
    return dbUser;
  }

  async updateUserProfile(
    id: number,
    inputData: UpdateUserDto,
    user: UserEntity,
  ): Promise<UpdateUserDto> {
    this.logger.log('Update user route is called');
    if (id !== user.id) {
      this.logger.debug('Unauthorized to access the resource');
      throw new ForbiddenException('You are not authorized access the profile');
    }
    const dbUser = await this.userRepository.findOne({ where: { id: id } });
    if (!dbUser) {
      this.logger.debug(`User not found with id ${id}`);
      this.chatGateway.sendMessage(
        `Hey! user clicked the update API to update his profile with id ${id}, but request was unsuccessful`,
      );
      throw new HttpException(
        `User not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (inputData.password) {
        const hashPassword = await this.authService.hashPassword(
          inputData.password,
        );
        inputData.password = hashPassword;
      }

      await this.userRepository.save(Object.assign(dbUser, inputData));
      this.logger.debug(`Found user with id ${id}`);
      this.chatGateway.sendMessage(
        `Hey! user clicked the update API to update his profile with id ${id} and updated successfully`,
      );
      return dbUser;
    }
  }

  async deleteUserProfile(id: number, user: UserEntity): Promise<undefined> {
    this.logger.log('Delete user route is called');
    if (id !== user.id) {
      this.logger.debug('Unauthorized to access the resource');
      throw new ForbiddenException('You are not authorized access the profile');
    }
    const dbUser = await this.userRepository.findOne({ where: { id: id } });
    if (!dbUser) {
      this.logger.debug(`User not found with id ${id}`);
      this.chatGateway.sendMessage(
        `Hey! user clicked the delete API to delete user was unsuccessful`,
      );
      throw new HttpException(
        `User not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      await this.userRepository.remove(dbUser);
      this.logger.debug(`User deleted from Database`);
      this.chatGateway.sendMessage(
        `Hey! user clicked the delete API to delete user was successful`,
      );
      return;
    }
  }
}
