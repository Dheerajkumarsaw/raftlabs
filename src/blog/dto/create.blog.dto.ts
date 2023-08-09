import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({
    description: 'Blog title',
    example: 'About Raftlabs',
  })
  @IsString()
  @Length(5, 20, {
    message: 'Blog title should be more than 5 and less than 20 letters',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Blog description',
    example:
      'We are an award-winning, top app development company in Ireland, specializing in building SaaS, Media & Marketing web and mobile app development services ...',
  })
  @IsString()
  @IsNotEmpty()
  @Length(50, 300, {
    message: 'Description should be more than 50 and less than 300 letters',
  })
  description: string;
}
