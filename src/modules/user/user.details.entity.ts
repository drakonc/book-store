import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { StatusConfig } from '../../config/config.status'

@Entity('user_details')
export class UserDetails extends BaseEntity {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  lastname: string;

  @Column({ type: 'varchar', default: StatusConfig.ACTIVO, length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_at', nullable: true })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'update_at', nullable: true })
  updateAt: Date;
}
