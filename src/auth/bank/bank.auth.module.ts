import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { BankAuthService } from './bank.auth.service';
import { BankAuthController } from './bank.auth.controller';
import { BankService } from 'src/models/bank/bank.service';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import { BankModule } from 'src/models/bank/bank.module';

@Module({
  imports: [BankModule, PassportModule],
  providers: [BankAuthService, BankService, LocalStrategy, ApiKeyStrategy],
  controllers: [BankAuthController],
  exports: [BankAuthService],
})
export class BankAuthModule {}
