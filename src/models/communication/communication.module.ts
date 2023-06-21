import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationEntity } from './entities/communication.entity';
import { MessageEntity } from './entities/message.entity';
import { UserService } from '../user/user.service';
import { BankService } from '../bank/bank.service';
import { UserModule } from '../user/user.module';
import { BankModule } from '../bank/bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunicationEntity, MessageEntity]),
    BankModule,
    UserModule,
  ],
  providers: [UserService, BankService],
  controllers: [],
  exports: [TypeOrmModule],
})
export class CommunicationModule {}
