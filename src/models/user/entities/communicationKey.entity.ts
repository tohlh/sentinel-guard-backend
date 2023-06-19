import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('UserCommunicationKey')
export class UserCommunicationKeyEntity {
  @PrimaryGeneratedColumn('uuid')
  key: string;

  @ManyToOne(() => UserEntity, (user) => user.communicationKeys)
  user: UserEntity;
}
