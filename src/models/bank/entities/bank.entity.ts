import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Bank')
export class BankEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  passwordDigest: string;

  @Column({ unique: true })
  apiKey: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
  })
  created_at?: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
  })
  updated_at?: Date;
}
