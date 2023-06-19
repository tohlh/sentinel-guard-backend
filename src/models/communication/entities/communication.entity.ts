import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Communication')
export class CommunicationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  bankKey: string;

  @Column({ nullable: false })
  userKey: string;
}
