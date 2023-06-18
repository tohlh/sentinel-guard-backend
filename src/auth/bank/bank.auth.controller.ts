import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BankAuthService } from './bank.auth.service';
import { LocalAuthGuard } from './guard/local.guard';
import { ApiKeyAuthGuard } from './guard/apikey.guard';

@Controller('auth/bank')
export class BankAuthController {
  constructor(private bankAuthService: BankAuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() bank) {
    const apiKey = await this.bankAuthService.retrieveApiKey(bank.username);
    return {
      apiKey,
    };
  }

  @Post('register')
  async register(
    @Body()
    credentials: {
      name: string;
      username: string;
      password: string;
      passwordConfirmation: string;
    },
  ) {
    try {
      const apiKey = await this.bankAuthService.register(
        credentials.name,
        credentials.username,
        credentials.password,
        credentials.passwordConfirmation,
      );
      return {
        apiKey,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('generateApiKey')
  async generateApiKey(@Body() credentials: { username: string }) {
    const apiKey = await this.bankAuthService.generateAndSaveApiKey(
      credentials.username,
    );
    return {
      apiKey,
    };
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('profile')
  async profile(@Req() request: any) {
    const { passwordDigest, ...res } = request.user;
    return res;
  }
}
