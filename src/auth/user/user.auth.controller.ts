import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserAuthService } from './user.auth.service';
import { LocalAuthGuard } from './guard/local.guard';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth/user')
export class UserAuthController {
  constructor(private userAuthService: UserAuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() credentials: { email: string; password: string }) {
    const token = await this.userAuthService.login(
      credentials.email,
      credentials.password,
    );
    return {
      access_token: token,
    };
  }

  @Post('register')
  async register(
    @Body()
    credentials: {
      email: string;
      password: string;
      passwordConfirmation: string;
    },
  ) {
    try {
      const token = await this.userAuthService.register(
        credentials.email,
        credentials.password,
        credentials.passwordConfirmation,
      );
      return {
        access_token: token,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    const { id, passwordDigest, ...res } = req.user;
    return res;
  }
}
