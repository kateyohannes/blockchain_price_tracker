import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coin: string;

  @Column({ type: 'numeric', precision: 18, scale: 16 })
  price: number;

  @Column({ type: 'varchar', length: '5', default: 'USD' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(tracker: Partial<Tracker>) {
    Object.assign(this, tracker);
  }
}
