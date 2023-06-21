import { Module } from '@nestjs/common';
import { BankEntity } from './entities/bank.entity';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationEntity } from '../communication/entities/communication.entity';
import { UserCommunicationKeyEntity } from '../user/entities/communicationKey.entity';
import { MessageEntity } from '../communication/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankEntity,
      CommunicationEntity,
      UserCommunicationKeyEntity,
      MessageEntity,
    ]),
  ],
  providers: [BankService],
  controllers: [BankController],
  exports: [TypeOrmModule, BankService],
})
export class BankModule {}
