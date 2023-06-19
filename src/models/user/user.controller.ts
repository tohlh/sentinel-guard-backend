import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/user/guard/jwt.guard';
import { UserService } from './user.service';

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
}
