import {
  Controller,
  Delete,
  Get,
  Patch,
  Body,
  Post,
  InternalServerErrorException,
  Param,
  NotFoundException,
  HttpCode,
  BadRequestException,
  UseGuards,
  ForbiddenException,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { AuthGuardJwt } from 'src/auth/auth.guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserEntity } from './user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { TransformInterceptor } from './trasnform.iterceptor';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('users')
@SerializeOptions({ strategy: 'excludeAll' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Created user response',
    type: UserEntity,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong ! Try again' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  async createUser(@Body() input: CreateUserDto): Promise<CreateUserDto> {
    try {
      return this.userService.createUserProfile(input);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  @ApiOkResponse({
    description: 'Request successfully completed',
    type: UserEntity,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong ! Try again' })
  @ApiNotFoundResponse({ description: 'Record Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiForbiddenResponse({
    description: 'User not authorized to access the resource',
  })
  @ApiUnauthorizedResponse({ description: 'You are unauthorized' })
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(CacheInterceptor)
  async getUser(
    @Param('id') id: number,
    @CurrentUser() user: UserEntity,
    @Res() response,
  ): Promise<CreateUserDto | unknown> {
    try {
      const data = await this.userService.getUserProfile(Number(id), user);
      return response.send(data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Request successfully completed',
    type: UserEntity,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong ! Try again' })
  @ApiNotFoundResponse({ description: 'Record Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiForbiddenResponse({
    description: 'User not authorized to access the resource',
  })
  @UseGuards(AuthGuardJwt)
  @ApiBadRequestResponse({ description: 'Something went wrong ! Try again' })
  @ApiUnauthorizedResponse({ description: 'Something went wrong ! Try again' })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateUser(
    @Param('id') id: number,
    @Body() inputData: UpdateUserDto,
    @CurrentUser() user: UserEntity,
  ): Promise<UpdateUserDto> {
    try {
      return this.userService.updateUserProfile(Number(id), inputData, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Record Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiForbiddenResponse({
    description: 'User not authorized to access the resource',
  })
  @UseGuards(AuthGuardJwt)
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<undefined> {
    try {
      return this.userService.deleteUserProfile(Number(id), user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
