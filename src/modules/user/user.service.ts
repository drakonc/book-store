import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { StatusConfig } from '../../shared/config.status'
import { RoleRepository } from '../role/role.repository';
import { ReadUserDto, UpdateUserDto } from './dto';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer'
import { Role } from '../role/role.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserRepository) private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository) private readonly _roleRepository: RoleRepository
    ) { }

    async get(id: number): Promise<ReadUserDto> {
        if (!id) throw new BadRequestException('id No Enviado');
        const user: User = await this._userRepository.findOne(id, { where: { status: StatusConfig.ACTIVO } });
        if (!user) throw new NotFoundException('Usuario No Existe');
        return plainToClass(ReadUserDto, user);
    }

    async getAll(): Promise<ReadUserDto[]> {
        const users: User[] = await this._userRepository.find({ where: { status: StatusConfig.ACTIVO } });
        return users.map((user: User) => plainToClass(ReadUserDto, user))

    }

    async update(userId: number, user: Partial<UpdateUserDto>): Promise<ReadUserDto> {
        const fiendUser = await this._userRepository.findOne(userId, { where: { status: StatusConfig.ACTIVO } })
        if (!fiendUser) throw new NotFoundException('Usuario No Encontrado')
        fiendUser.username = user.username;
        const updateUser = await this._userRepository.save(fiendUser)
        return plainToClass(ReadUserDto, updateUser);
    }

    async delete(userId: number): Promise<void> {
        const userExist: User = await this._userRepository.findOne(userId, { where: { status: StatusConfig.ACTIVO } });
        if (!userExist) throw new NotFoundException('id No Enviado');
        const deleteUser = await this._userRepository.update(userId, { status: StatusConfig.INACTIVO });
        const user: ReadUserDto = plainToClass(ReadUserDto, deleteUser);
    }

    async setRoleToUser(userId: number, roleId: number): Promise<Boolean> {
        const userExist: User = await this._userRepository.findOne(userId, { where: { status: StatusConfig.ACTIVO } });
        if (!userExist) throw new NotFoundException('Usuario No Existe');
        const roleExist: Role = await this._roleRepository.findOne(roleId, { where: { status: StatusConfig.ACTIVO } });
        if (!roleExist) throw new NotFoundException('Role No Existe');
        userExist.roles.push(roleExist);
        await this._userRepository.save(userExist);
        return true;
    }

}
