import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('roles')
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @ManyToMany(type => User, user => user.roles)
    @JoinColumn()
    user: User[];

    @Column({ type: 'varchar', default: 'Activo', length: 8 })
    status: string;

    @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
    updateAt: Date;

}
