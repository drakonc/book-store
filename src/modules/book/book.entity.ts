import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { StatusConfig } from '../../shared/config.status';
import { User } from '../user/user.entity';

@Entity('books')
export class Book extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 500 })
    description: string;

    @ManyToMany(type => User, user => user.books)
    @JoinColumn()
    authors: User[]

    @Column({ type: 'varchar', default: StatusConfig.ACTIVO, length: 8 })
    status: string;


    @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
    updateAt: Date;

}