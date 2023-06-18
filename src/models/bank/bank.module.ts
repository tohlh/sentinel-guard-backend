import { Module } from '@nestjs/common';
import { BankEntity } from './entities/bank.entity';
import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity])],
  providers: [BankService],
  controllers: [BankController],
  exports: [TypeOrmModule],
})
export class BankModule {}
