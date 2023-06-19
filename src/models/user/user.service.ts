import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserCommunicationKeyEntity } from './entities/communicationKey.entity';
import { BankService } from '../bank/bank.service';
import { CommunicationEntity } from '../communication/entities/communication.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserCommunicationKeyEntity)
    private userCommunicationKeysRepository: Repository<UserCommunicationKeyEntity>,
    @InjectRepository(CommunicationEntity)
    private communicationRepository: Repository<CommunicationEntity>,
    private bankService: BankService,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(data: number | any): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne(data);
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    return this.findOne({ where: { email } });
  }

  async create(data) {
    return await this.userRepository.save(data).then((res) => {
      res.passwordDigest = undefined;
      return res;
    });
  }

  async update(
    id: number,
    data: object,
  ): Promise<UserEntity | UpdateResult | undefined> {
    const book = await this.findOne(id).then((res) => res);
    if (book)
      return await this.userRepository.update(id, data).then((res) => res);
    return;
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async getBanks(user: UserEntity) {
    const { communicationKeys } = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['communicationKeys'],
    });

    const bankKeys = await Promise.all(
      communicationKeys.map(async (key) => {
        const { bankKey } = await this.communicationRepository.findOne({
          where: { userKey: key.key },
        });
        return bankKey;
      }),
    );

    const banks = await Promise.all(
      bankKeys.map(async (key) => {
        const { name, communicationKey } =
          await this.bankService.findOneByCommunicationKey(key);
        return { name, communicationKey };
      }),
    );

    return banks;
  }

  async addBank(user: UserEntity, bankKey: string) {
    const bank = await this.bankService.findOneByCommunicationKey(bankKey);
    const userBank = await this.communicationRepository.findOne({
      where: { bankKey },
    });
    if (!bank || userBank) {
      throw new Error('Bank not found');
    }
    const userKey = await this.addCommunicationKey(user);
    return await this.communicationRepository.save({
      userKey: userKey,
      bankKey: bankKey,
    });
  }

  async removeBank(user: UserEntity, bankKey: string) {
    const bank = await this.bankService.findOneByCommunicationKey(bankKey);
    const userBank = await this.communicationRepository.findOne({
      where: { bankKey },
    });
    if (!bank || !userBank) {
      throw new Error('Bank not found');
    }
    return await this.communicationRepository.delete({
      userKey: userBank.userKey,
      bankKey: bankKey,
    });
  }

  private async addCommunicationKey(user: UserEntity) {
    const { key } = await this.userCommunicationKeysRepository.save({
      user,
    });
    return key;
  }
}
