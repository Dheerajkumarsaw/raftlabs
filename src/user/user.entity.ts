import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BlogEntity } from 'src/blog/blog.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @ApiProperty({
    description: 'User id',
  })
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @ApiProperty({
    description: 'User first name',
  })
  @Expose()
  @Column({ nullable: false, length: 20 })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
  })
  @Expose()
  @Column({ nullable: false, length: 20 })
  lastName: string;

  @ApiProperty({
    description: 'User mobile no',
  })
  @Expose()
  @Column({ unique: true, nullable: false })
  mobile: string;

  @ApiProperty({
    description: 'User email',
  })
  @Expose()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'User password',
  })
  @Column()
  password: string;

  @ApiProperty({
    description: "User's username",
  })
  @Expose()
  @Column({ unique: true, nullable: false })
  username: string;

  @ApiProperty({
    description: 'User address',
  })
  @Expose()
  @Column()
  address: string;

  @ApiProperty({
    description: 'User blogs',
  })
  @OneToMany(() => BlogEntity, (blog) => blog.user, { onDelete: 'CASCADE' })
  blogs: BlogEntity[];
}
