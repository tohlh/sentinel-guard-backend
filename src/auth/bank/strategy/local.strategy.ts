import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BankAuthService } from '../bank.auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'bank-local') {
  constructor(private bankAuthService: BankAuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const bank = await this.bankAuthService.validate(username, password);
    if (!bank) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return bank;
  }
}
