import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlogEntity {
  @ApiProperty({
    description: 'Blog id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Blog Title',
  })
  @Column({ nullable: false, length: 20 })
  title: string;

  @ApiProperty({
    description: 'Blog description',
  })
  @Column({ nullable: false, length: 300 })
  description: string;

  @ApiProperty({
    description: 'User who created this blog',
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.blogs, {
    nullable: false,
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: UserEntity;
}
