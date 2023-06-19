import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BankEntity } from '../bank/entities/bank.entity';
import { BankService } from '../bank/bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommunicationKeyEntity } from './entities/communicationKey.entity';
import { CommunicationEntity } from '../communication/entities/communication.entity';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserCommunicationKeyEntity,
      CommunicationEntity,
      BankEntity,
    ]),
    BankModule,
  ],
  providers: [UserService, BankService],
  controllers: [UserController],
  exports: [TypeOrmModule],
})
export class UserModule {}
