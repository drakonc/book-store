import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusConfig } from '../../config/config.status'
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository
    ) { }

    async get(id: number): Promise<User> {
        if (!id) throw new BadRequestException('id No Enviado');
        const user: User = await this._userRepository.findOne(id, { where: { status: StatusConfig.ACTIVO } });
        if (!user) throw new NotFoundException();
        return user;
    }

    async getAll(): Promise<User[]> {
        const users: User[] = await this._userRepository.find({ where: { status: StatusConfig.ACTIVO } });
        return users;

    }

    async create(user: User): Promise<User> {
        const details = new UserDetails();
        user.details = details;
        const repo = await getConnection().getRepository(Role);
        const defaulRole = await repo.findOne({ where: { name: 'General' } })
        user.roles = [defaulRole];
        const saveUsers: User = await this._userRepository.save(user);
        return saveUsers;
    }

    async update(id: number, user: User): Promise<void> {
        await this._userRepository.update(id, user);
    }

    async delete(id: number): Promise<void> {
        const userExist: User = await this._userRepository.findOne(id, { where: { status: StatusConfig.ACTIVO } });
        if (!userExist) throw new BadRequestException('id No Enviado');
        await this._userRepository.update(id, { status: StatusConfig.INACTIVO });
    }

}
