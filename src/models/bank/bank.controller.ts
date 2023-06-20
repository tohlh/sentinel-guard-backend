import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyAuthGuard } from 'src/auth/bank/guard/apikey.guard';
import { BankService } from './bank.service';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @UseGuards(ApiKeyAuthGuard)
  @Get('get_users')
  async getUsers(@Req() request: any) {
    const { communicationKey } = request.user;
    try {
      const users = await this.bankService.findUsers(communicationKey);
      return { users };
    } catch {
      throw new BadRequestException('Error getting users');
    }
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('get_user/:userCommunicationKey')
  async getUser(
    @Req() request: any,
    @Param('userCommunicationKey') userCommunicationKey: string,
  ) {
    const { communicationKey } = request.user;

    try {
      const user = await this.bankService.findUserByCommunicationKey(
        communicationKey,
        userCommunicationKey,
      );
      return { user };
    } catch {
      throw new BadRequestException('Error getting user');
    }
  }
}
