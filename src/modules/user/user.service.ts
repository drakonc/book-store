import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MapperService } from '../../shared/mapper.service';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        private readonly _mapperService: MapperService
    ) { }

    async get(id: number): Promise<UserDto> {
        if (!id) {
            throw new BadRequestException('id No Enviado');
        }

        const user: User = await this._userRepository.findOne(id, { where: { status: 'Activo' } });

        if (!user) {
            throw new NotFoundException();
        }

        return this._mapperService.map<User, UserDto>(user, new UserDto);
    }

    async getAll(): Promise<UserDto[]> {

        const users: User[] = await this._userRepository.find({ where: { status: 'Activo' } });
        return this._mapperService.mapCollection<User, UserDto>(users, new UserDto)

    }

    async create(user: User): Promise<UserDto> {
        const details = new UserDetails();
        user.details = details;

        const repo = await getConnection().getRepository(Role);
        const defaulRole = await repo.findOne({ where: { name: 'General' } })
        user.roles = [defaulRole];

        const saveUsers: User = await this._userRepository.save(user);
        return this._mapperService.map<User, UserDto>(saveUsers, new UserDto);

    }

    async update(id: number, user: User): Promise<void> {

        await this._userRepository.update(id, user);

    }

    async delete(id: number): Promise<void> {

        const userExist: User = await this._userRepository.findOne(id, { where: { status: 'Activo' } });

        if (!userExist) throw new BadRequestException('id No Enviado');

        await this._userRepository.update(id, { status: 'Inacivo' });

    }

}
