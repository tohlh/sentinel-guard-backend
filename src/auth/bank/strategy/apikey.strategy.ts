import Strategy from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BankAuthService } from '../bank.auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private bankAuthService: BankAuthService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) =>
      this.validate(apiKey, done),
    );
  }

  async validate(
    apiKey: string,
    done: (error: Error, data) => void,
  ): Promise<any> {
    const bank = await this.bankAuthService.validateApiKey(apiKey);
    if (!bank) {
      done(new UnauthorizedException(), null);
    }
    done(null, bank);
  }
}
