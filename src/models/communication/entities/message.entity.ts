import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Message')
export class MessageEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  bankKey: string;

  @Column({ nullable: false })
  userKey: string;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  nonce: string;

  @Column({ nullable: false })
  mac: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP(6)',
    type: 'timestamp',
  })
  createdAt: Date;
}
