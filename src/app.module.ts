import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserAuthModule } from './auth/user/user.auth.module';
import { UserModule } from './models/user/user.module';
import { BankAuthModule } from './auth/bank/bank.auth.module';
import { CommunicationModule } from './models/communication/communication.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    UserAuthModule,
    BankAuthModule,
    UserModule,
    CommunicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
