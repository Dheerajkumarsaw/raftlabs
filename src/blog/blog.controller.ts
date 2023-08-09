import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create.blog.dto';
import { UpdateBlogDto } from './dto/update.blog.dto';
import { AuthGuardJwt } from 'src/auth/auth.guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BlogEntity } from './blog.entity';
import { BlogResponseDto } from './dto/response.-blog.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Blog')
@ApiBearerAuth('access-token')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong ! Try again' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiUnauthorizedResponse({ description: 'You are unauthorized' })
  @UseGuards(AuthGuardJwt)
  async createPost(
    @Body() input: CreateBlogDto,
    @CurrentUser() user: UserEntity,
  ): Promise<CreateBlogDto> {
    try {
      return this.blogService.createBlog(input, user.id);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw (e.message = 'please login first');
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Request successfully completed',
    type: BlogResponseDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiNotFoundResponse({ description: 'Record Not found' })
  async getPost(@Param('id') id: number): Promise<CreateBlogDto> {
    try {
      return this.blogService.readBlog(id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Request successfully completed',
    type: BlogResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Something went wrong ! Try again' })
  @ApiNotFoundResponse({ description: 'Record Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiForbiddenResponse({
    description: 'User not authorized to access the resource',
  })
  @UseGuards(AuthGuardJwt)
  async updatePost(
    @Body() input: UpdateBlogDto,
    @Param('id') id: number,
    @CurrentUser() jwtUser: UserEntity,
  ): Promise<UpdateBlogInterface> {
    try {
      return this.blogService.updateBlog(input, id, jwtUser.id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Request successful',
  })
  @ApiNotFoundResponse({ description: 'Record Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error !' })
  @ApiForbiddenResponse({
    description: 'User not authorized to access the resource',
  })
  @UseGuards(AuthGuardJwt)
  async deletePost(
    @Param('id') id: number,
    @CurrentUser() jwtUser: UserEntity,
  ): Promise<undefined> {
    try {
      return this.blogService.deleteBlog(id, jwtUser.id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Get()
  @ApiOkResponse({
    description: 'Request successfully completed',
    type: BlogResponseDto,
  })
  async findAll(): Promise<GetAllBlogInterface[]> {
    try {
      return this.blogService.getAllBlog();
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
