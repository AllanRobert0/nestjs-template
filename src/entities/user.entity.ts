import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { compare } from 'bcryptjs';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({
    name: 'active',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  active: boolean;

  @Column({
    name: 'telephone',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  telephone: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  async comparePassword(passwordInText: string): Promise<boolean> {
    return compare(passwordInText, this.password);
  }
}
