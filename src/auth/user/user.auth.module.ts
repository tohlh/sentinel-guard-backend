import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from 'src/models/user/user.module';
import { UserAuthService } from './user.auth.service';
import { UserAuthController } from './user.auth.controller';
import { UserService } from 'src/models/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { BankModule } from 'src/models/bank/bank.module';
import { CommunicationModule } from 'src/models/communication/communication.module';
import { BankService } from 'src/models/bank/bank.service';

@Module({
  imports: [
    UserModule,
    BankModule,
    PassportModule,
    CommunicationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: jwtConstants.signOptions,
    }),
  ],
  providers: [
    UserAuthService,
    UserService,
    BankService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [UserAuthController],
  exports: [UserAuthService],
})
export class UserAuthModule {}
