import { ApiProperty } from '@nestjs/swagger';

export class BlogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
