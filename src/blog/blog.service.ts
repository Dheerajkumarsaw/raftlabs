import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create.blog.dto';
import { UpdateBlogDto } from './dto/update.blog.dto';
import { UserEntity } from 'src/user/user.entity';
import { ChatGateway } from 'src/chats/chats.gateway';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepository: Repository<BlogEntity>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async createBlog(data: CreateBlogDto, id: number): Promise<CreateBlogDto> {
    this.logger.log('Blog create route is called');
    const blogCreator = new UserEntity();
    blogCreator.id = id;
    const createdBlog = new BlogEntity();
    createdBlog.description = data.description;
    createdBlog.title = data.title;
    createdBlog.user = blogCreator;
    await this.blogRepository.save(createdBlog);
    this.logger.debug(`New blog created successfully ${createdBlog}`);
    this.chatGateway.sendMessage(`Hey user with id ${id} created new blog`);
    return createdBlog;
  }

  async readBlog(id: number): Promise<GetAllBlogInterface> {
    this.logger.log('Read blog route is called');
    const blog = await this.blogRepository.findOne({
      where: { id: id },
    });
    if (blog == null) {
      this.logger.debug(`Blog not found`);
      throw new HttpException(
        `Blog not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else {
      this.logger.debug(`Found this blog ${blog}`);
      this.chatGateway.sendMessage(
        `Hey someone hit the get api of the resource to read the blog`,
      );
      return {
        id: blog.id,
        title: blog.title,
        description: blog.description,
      };
    }
  }

  async updateBlog(
    inputData: UpdateBlogDto,
    id: number,
    jwtUserId: number,
  ): Promise<UpdateBlogInterface> {
    this.logger.log('Update blog route is called');
    const data = await this.blogRepository.findOne({
      where: { id: id },
    });
    if (!data) {
      this.logger.debug(`Blog not found`);
      throw new HttpException(
        `Blog not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else if (data.user.id !== jwtUserId) {
      throw new ForbiddenException('You not allowed to update this resource');
    } else {
      await this.blogRepository.save(Object.assign(data, inputData));
      this.logger.debug(`Updated blog ${data} `);
      this.chatGateway.sendMessage(
        `Hey user with id ${jwtUserId} update the existing blog with id ${id}`,
      );
      return { id: data.id, title: data.title, description: data.description };
    }
  }

  async deleteBlog(id: number, jwtUserId: number): Promise<undefined> {
    this.logger.log('Delete blog route is called');
    const blog = await this.blogRepository.findOne({
      where: { id: id },
    });
    if (!blog) {
      this.logger.debug(`Blog not found with id ${id}`);
      throw new HttpException(
        `Blog not found with id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    } else if (blog.user.id !== jwtUserId) {
      throw new ForbiddenException('You not allowed to update this resource');
    } else {
      await this.blogRepository.remove(blog);
      this.logger.debug(`Found blog delete successfully`);
      this.chatGateway.sendMessage(
        `Hey user with id ${jwtUserId} deleted the existing blog with id ${id}`,
      );
      return;
    }
  }

  async getAllBlog(): Promise<GetAllBlogInterface[]> {
    this.logger.log('Get all blogs route is called');
    const allBlogs = await this.blogRepository.find();
    if (allBlogs.length == 0) {
      this.logger.debug(`Blogs not found`);
      throw new HttpException('Blogs not found', HttpStatus.NOT_FOUND);
    }
    this.logger.debug(`Found all the blogs`);
    this.chatGateway.sendMessage(
      `Hey someone hit the getAll api of the resource to read all the blog`,
    );
    return allBlogs.map((blog) => {
      return {
        id: blog.id,
        title: blog.title,
        description: blog.description,
      };
    });
  }
}
