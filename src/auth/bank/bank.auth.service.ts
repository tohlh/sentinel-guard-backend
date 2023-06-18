import { Injectable } from '@nestjs/common';
import { BankService } from 'src/models/bank/bank.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class BankAuthService {
  constructor(private bankService: BankService) {}

  async validate(username: string, password: string): Promise<any> {
    const bank = await this.bankService.findOneByUsername(username);
    if (!bank) {
      return null;
    }
    if (await bcrypt.compareSync(password, bank.passwordDigest)) {
      const { passwordDigest, ...result } = bank;
      return result;
    }
    return null;
  }

  async login(username: string, password: string): Promise<any> {
    const bank = await this.validate(username, password);
    if (bank) {
      return bank.apiKey ? bank.apiKey : this.generateApiKey();
    }
    return null;
  }

  async register(
    name: string,
    username: string,
    password: string,
    passwordConfirmation: string,
  ): Promise<any> {
    if (password !== passwordConfirmation) {
      throw new Error('Password confirmation does not match password');
    }
    try {
      const bank = await this.bankService.create({
        name: name,
        username: username,
        passwordDigest: await bcrypt.hash(password, 10),
        apiKey: this.generateApiKey(),
      });
      return bank.apiKey;
    } catch (err) {
      console.log(err);
      throw new Error('Username has been registered');
    }
  }

  // This method is used by the API key guard
  async validateApiKey(apiKey: string): Promise<any> {
    const bank = await this.bankService.findOneByApiKey(apiKey);
    if (bank) {
      return bank;
    }
    return null;
  }

  async generateAndSaveApiKey(username: string): Promise<string> {
    const apiKey = this.generateApiKey();
    const bank = await this.bankService.findOneByUsername(username);
    await this.bankService.update(bank.id, { apiKey });
    return apiKey;
  }

  async retrieveApiKey(username: string): Promise<string> {
    const bank = await this.bankService.findOneByUsername(username);
    return bank.apiKey;
  }

  generateApiKey(): string {
    return 'bank.' + randomUUID();
  }
}
