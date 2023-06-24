import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BankService } from '../bank/bank.service';
import { UserCommunicationKeyEntity } from './entities/communicationKey.entity';
import { CommunicationEntity } from '../communication/entities/communication.entity';
import { MessageEntity } from '../communication/entities/message.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserCommunicationKeyEntity)
    private userCommunicationKeysRepository: Repository<UserCommunicationKeyEntity>,
    @InjectRepository(CommunicationEntity)
    private communicationRepository: Repository<CommunicationEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
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
        return { bankCommunicationKey: bankKey, userCommunicationKey: key.key };
      }),
    );

    const banks = await Promise.all(
      bankKeys.map(async (x) => {
        const { name, communicationKey, publicKey } =
          await this.bankService.findOneByCommunicationKey(
            x.bankCommunicationKey,
          );
        return {
          name,
          bankCommunicationKey: communicationKey,
          userCommunicationKey: x.userCommunicationKey,
          publicKey: publicKey,
        };
      }),
    );

    return banks;
  }

  async getBank(user: UserEntity, bankCommunicationKey) {
    const userBanks = await this.getBanks(user);

    const userBank = userBanks.find(
      (bank) => bank.bankCommunicationKey === bankCommunicationKey,
    );

    if (!userBank) {
      throw new Error('Bank not found');
    }

    const { name, communicationKey, publicKey } =
      await this.bankService.findOneByCommunicationKey(bankCommunicationKey);

    return {
      name,
      bankCommunicationKey: communicationKey,
      userCommunicationKey: userBank.userCommunicationKey,
      publicKey,
    };
  }

  async addBank(user: UserEntity, bankKey: string) {
    const bank = await this.bankService.findOneByCommunicationKey(bankKey);
    if (!bank) {
      throw new Error('Bank not found');
    }

    const userBanks = await this.getBanks(user);
    if (userBanks.some((bank) => bank.bankCommunicationKey === bankKey)) {
      throw new Error('Bank already added');
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

    await this.userCommunicationKeysRepository.delete({
      key: userBank.userKey,
    });

    await this.communicationRepository.delete({
      userKey: userBank.userKey,
      bankKey: bankKey,
    });

    await this.messageRepository.delete({
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

  async updatePublicKey(user: UserEntity, publicKey: string) {
    return await this.userRepository.update(user.id, { publicKey });
  }

  async getMessages(bankCommunicationKey: string, user: UserEntity) {
    const userBanks = await this.getBanks(user);

    const userBank = userBanks.find(
      (bank) => bank.bankCommunicationKey === bankCommunicationKey,
    );

    if (!userBank) {
      throw new Error('Bank not found');
    }

    const messages = await this.messageRepository.find({
      where: {
        bankKey: userBank.bankCommunicationKey,
        userKey: userBank.userCommunicationKey,
      },
    });

    return messages.map((message) => {
      return {
        id: message.id,
        message: message.content,
        nonce: message.nonce,
        mac: message.mac,
        createdAt: message.createdAt,
      };
    });
  }
}
