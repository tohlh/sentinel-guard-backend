import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BankEntity } from '../bank/entities/bank.entity';
import { BankService } from '../bank/bank.service';
import { BankModule } from '../bank/bank.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommunicationKeyEntity } from './entities/communicationKey.entity';
import { CommunicationEntity } from '../communication/entities/communication.entity';
import { MessageEntity } from '../communication/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserCommunicationKeyEntity,
      CommunicationEntity,
      MessageEntity,
      BankEntity,
    ]),
    BankModule,
  ],
  providers: [UserService, BankService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
