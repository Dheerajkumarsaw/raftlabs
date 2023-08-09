import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name  who trying to register',
    example: 'raftlabs',
  })
  @Length(5, 20, { message: 'First Name should be in between 5 to 20 letters' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name  who trying to register',
    example: 'raftlabs',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 20, { message: 'Last Name should be in between 5 to 20 letters' })
  lastName: string;

  @ApiProperty({
    description: 'User mobile no who trying to register',
    example: '9785463258',
  })
  @IsPhoneNumber('IN')
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    description: 'User email who trying to register',
    example: 'raftlabs@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password who trying to register',
    example: 'raftlabs',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "User's username  who trying to register",
    example: 'raftlabs',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User address  who trying to register',
    example: 'Ahmedabad',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
