import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description:"The user password who trying to login",
    example:"raftlabs"
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description:"The user username who trying to login",
    example:"raftlabs"
  })
  @IsString()
  @IsNotEmpty()
  username: string;
}
