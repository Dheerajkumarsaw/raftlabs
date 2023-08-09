import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    this.logger.log('validate user called');
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      this.logger.debug('User not found');
      throw new UnauthorizedException('User not found Register first');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${username}`);
      throw new UnauthorizedException(
        'Provided credentials are miss matched please check once username and password',
      );
    }
    return user;
  }
}
