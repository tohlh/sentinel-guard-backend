import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CommunicationEntity } from '../../communication/entities/communication.entity';
import { UserCommunicationKeyEntity } from './communicationKey.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  passwordDigest: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
  })
  createdAt?: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
  })
  updatedAt?: Date;

  @OneToMany(
    () => UserCommunicationKeyEntity,
    (communicationKey) => communicationKey.user,
  )
  communicationKeys: UserCommunicationKeyEntity[];

  @Column({ nullable: true })
  publicKey: string;
}
