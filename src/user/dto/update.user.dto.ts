import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name who trying to update his first name',
    example: 'raftlabs',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 20, { message: 'First Name should be in between 5 to 20 letters' })
  firstName?: string;

  @ApiProperty({
    description: 'User last name who trying to update his last name',
    example: 'raftlabs',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Length(5, 20, { message: 'Last Name should be in between 5 to 20 letters' })
  lastName?: string;

  @ApiProperty({
    description: 'User mobile no who trying to update',
    example: '9785463258',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  mobile?: string;

  @ApiProperty({
    description: 'User email who trying to update',
    example: 'raftlabs@gmail.com',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'User password who trying to register',
    example: 'raftlabs',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'User address who trying to update',
    example: 'Delhi',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  address?: string;

  @ApiProperty({
    description: "User's username  who trying to update",
    example: 'raftlabsDelhi',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;
}
