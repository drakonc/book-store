import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusConfig } from '../../shared/config.status'
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserRepository) private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository) private readonly _roleRepository: RoleRepository
    ) { }

    async get(id: number): Promise<User> {
        if (!id) throw new BadRequestException('id No Enviado');
        const user: User = await this._userRepository.findOne(id, { where: { status: StatusConfig.ACTIVO } });
        if (!user) throw new NotFoundException('Usuario No Existe');
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
        if (!userExist) throw new NotFoundException('id No Enviado');
        await this._userRepository.update(id, { status: StatusConfig.INACTIVO });
    }

    async setRoleToUser(userId: number, roleId: number) {
        const userExist: User = await this._userRepository.findOne(userId, { where: { status: StatusConfig.ACTIVO } });
        if (!userExist) throw new NotFoundException('Usuario No Existe');

        const roleExist: Role = await this._roleRepository.findOne(roleId, { where: { status: StatusConfig.ACTIVO } });
        if (!roleExist) throw new NotFoundException('Role No Existe');

        userExist.roles.push(roleExist);
        await this._userRepository.save(userExist);

        return true;
    }

}
