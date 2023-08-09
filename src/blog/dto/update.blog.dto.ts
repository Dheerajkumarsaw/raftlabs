import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @Length(5, 20, {
    message: 'Blog title should be more than 5 and less than 20 letters',
  })
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsString()
  @Length(50, 300, {
    message: 'Description should be more than 50 and less than 300 letters',
  })
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
