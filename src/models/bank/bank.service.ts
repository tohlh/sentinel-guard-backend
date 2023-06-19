import { Injectable } from '@nestjs/common';
import { BankEntity } from './entities/bank.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(BankEntity)
    private bankRepository: Repository<BankEntity>,
  ) {}

  findAll(): Promise<BankEntity[]> {
    return this.bankRepository.find();
  }

  async findOne(data: number | any): Promise<BankEntity | undefined> {
    return await this.bankRepository.findOne(data);
  }

  async findOneByUsername(username: string): Promise<BankEntity | undefined> {
    return this.findOne({ where: { username } });
  }

  async findOneByApiKey(apiKey: string): Promise<BankEntity | undefined> {
    return this.findOne({ where: { apiKey } });
  }

  async findOneByCommunicationKey(
    communicationKey: string,
  ): Promise<BankEntity | undefined> {
    return this.findOne({ where: { communicationKey } });
  }

  async create(data) {
    return await this.bankRepository.save(data).then((res) => {
      res.passwordDigest = undefined;
      return res;
    });
  }

  async update(
    id: number,
    data: object,
  ): Promise<BankEntity | UpdateResult | undefined> {
    const book = await this.findOne({ where: { id } }).then((res) => res);
    if (book)
      return await this.bankRepository.update(id, data).then((res) => res);
    return;
  }

  async remove(id: number) {
    return await this.bankRepository.delete(id);
  }
}
