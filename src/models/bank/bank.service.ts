import { Injectable } from '@nestjs/common';
import { BankEntity } from './entities/bank.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommunicationEntity } from '../communication/entities/communication.entity';
import { UserCommunicationKeyEntity } from '../user/entities/communicationKey.entity';
import { MessageEntity } from '../communication/entities/message.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(BankEntity)
    private bankRepository: Repository<BankEntity>,
    @InjectRepository(CommunicationEntity)
    private communicationRepository: Repository<CommunicationEntity>,
    @InjectRepository(UserCommunicationKeyEntity)
    private userCommunicationKeysRepository: Repository<UserCommunicationKeyEntity>,
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
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

  async findUsers(bankCommunicationKey) {
    const userBank = await this.communicationRepository.find({
      where: { bankKey: bankCommunicationKey },
    });

    const users = await Promise.all(
      userBank.map((user) => {
        return this.userCommunicationKeysRepository
          .findOne({ where: { key: user.userKey }, relations: ['user'] })
          .then((res) => {
            const { name } = res.user;
            return { name, key: res.key };
          });
      }),
    );

    return users;
  }

  async findUserByCommunicationKey(
    bankCommunicationKey: string,
    userCommunicationKey: string,
  ) {
    const userBank = await this.communicationRepository.findOne({
      where: { bankKey: bankCommunicationKey, userKey: userCommunicationKey },
    });

    if (userBank) {
      return this.userCommunicationKeysRepository
        .findOne({ where: { key: userBank.userKey }, relations: ['user'] })
        .then((res) => {
          const { name, publicKey } = res.user;
          return { name, publicKey, key: res.key };
        });
    }
    return undefined;
  }

  async updatePublicKey(bank: BankEntity, publicKey: string) {
    return await this.bankRepository.update(bank.id, { publicKey });
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

  async sendMessage(
    bank: BankEntity,
    userCommunicationKey: string,
    newMessage: {
      content: string;
      nonce: string;
      mac: string;
    },
  ) {
    const userBank = await this.communicationRepository.findOne({
      where: { bankKey: bank.communicationKey, userKey: userCommunicationKey },
    });

    if (!userBank) {
      throw new Error('User not found');
    }

    const message = await this.messageRepository.save({
      bankKey: bank.communicationKey,
      userKey: userCommunicationKey,
      content: newMessage.content,
      nonce: newMessage.nonce,
      mac: newMessage.mac,
    });

    return message;
  }

  async getMessages(bank: BankEntity, userCommunicationKey: string) {
    const userBank = await this.communicationRepository.findOne({
      where: { bankKey: bank.communicationKey, userKey: userCommunicationKey },
    });

    if (!userBank) {
      throw new Error('User not found');
    }

    const messages = await this.messageRepository.find({
      where: { bankKey: bank.communicationKey, userKey: userCommunicationKey },
    });

    return messages.map((message) => {
      return {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
      };
    });
  }
}
