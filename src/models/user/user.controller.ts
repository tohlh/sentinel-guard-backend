import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/user/guard/jwt.guard';
import { UserService } from './user.service';
import { NotFoundError } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('get_banks')
  async getBanks(@Request() req) {
    const user = req.user;
    try {
      const banks = await this.userService.getBanks(user);
      return { banks };
    } catch (e) {
      throw new BadRequestException('Error getting banks');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_bank/:bankCommunicationKey')
  async getBank(
    @Request() req,
    @Param('bankCommunicationKey') bankCommunicationKey: string,
  ) {
    const user = req.user;
    try {
      const bank = await this.userService.getBank(user, bankCommunicationKey);
      return { bank };
    } catch (e) {
      throw new BadRequestException('Error getting bank');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('add_bank')
  async addBank(@Request() req) {
    const user = req.user;
    const { bankKey } = req.body;
    try {
      await this.userService.addBank(user, bankKey);
      return { message: 'Bank added' };
    } catch (e) {
      throw new BadRequestException('Error adding bank');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove_bank')
  async removeBank(@Request() req) {
    const user = req.user;
    const { bankKey } = req.body;
    try {
      await this.userService.removeBank(user, bankKey);
      return { message: 'Bank removed' };
    } catch (e) {
      throw new BadRequestException('Error removing bank');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update_public_key')
  async updatePublicKey(@Request() req) {
    const user = req.user;
    const { publicKey } = req.body;
    try {
      await this.userService.updatePublicKey(user, publicKey);
      return { message: 'Public key updated' };
    } catch (e) {
      throw new BadRequestException('Error updating public key');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('get_messages/:bankCommunicationKey')
  async getMessages(
    @Request() req,
    @Param('bankCommunicationKey') bankCommunicationKey: string,
  ) {
    const user = req.user;
    try {
      const messages = await this.userService.getMessages(
        bankCommunicationKey,
        user,
      );
      return { messages };
    } catch (e) {
      throw new NotFoundException('The bank is not found');
    }
  }
}
