import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { UserEntity } from 'src/user/user.entity';
import { AuthGuardLocal } from './auth.guard.local';
import { LocalStrategy } from './local.strategy';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly localStrategy: LocalStrategy,
  ) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(
    @Body() loginDetails: LoginDto,
    @CurrentUser() user: UserEntity,
  ): Promise<LoginInterface> {
    return {
      userId: user.id,
      token: this.authService.createTokenForUser(user),
    };
  }
}
