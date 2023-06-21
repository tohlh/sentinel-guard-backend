import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

  @UseGuards(ApiKeyAuthGuard)
  @Patch('update_public_key')
  async updatePublicKey(@Req() request: any) {
    const user = request.user;
    const { publicKey } = request.body;

    try {
      await this.bankService.updatePublicKey(user, publicKey);
      return { message: 'Public key updated' };
    } catch {
      throw new BadRequestException('Error updating public key');
    }
  }

  @UseGuards(ApiKeyAuthGuard)
  @Post('send_message/:userCommunicationKey')
  async sendMessage(
    @Req() request: any,
    @Param('userCommunicationKey') userCommunicationKey: string,
  ) {
    const bank = request.user;
    const { message } = request.body;
    try {
      await this.bankService.sendMessage(bank, userCommunicationKey, message);
      return { message: 'Message sent' };
    } catch {
      throw new BadRequestException('Error sending message');
    }
  }

  @UseGuards(ApiKeyAuthGuard)
  @Get('get_messages/:userCommunicationKey')
  async getMessages(
    @Req() request: any,
    @Param('userCommunicationKey') userCommunicationKey: string,
  ) {
    const bank = request.user;
    try {
      const messages = await this.bankService.getMessages(
        bank,
        userCommunicationKey,
      );
      return { messages };
    } catch {
      throw new BadRequestException('Error getting messages');
    }
  }
}
