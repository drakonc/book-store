import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer'
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';
import { StatusConfig } from '../../shared/config.status';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService {

    constructor(@InjectRepository(RoleRepository) private readonly _roleRepository: RoleRepository) { }

    async get(id: number): Promise<ReadRoleDto> {
        if (!id) throw new NotFoundException('id No Enviado');
        const role: Role = await this._roleRepository.findOne(id);
        if (!role) throw new NotFoundException();
        return plainToClass(ReadRoleDto, role);
    }

    async getAll(): Promise<ReadRoleDto[]> {
        const roles: Role[] = await this._roleRepository.find({ where: { status: StatusConfig.ACTIVO } });
        return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
    }

    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        const saveRole: Role = await this._roleRepository.save(role);
        return plainToClass(ReadRoleDto, saveRole);
    }

    async update(roleId: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
        const foundRole: Role = await this._roleRepository.findOne(roleId, { where: { status: StatusConfig.ACTIVO } });
        if (!foundRole) throw new NotFoundException('id No Enviado');
        foundRole.name = role.name;
        foundRole.description = role.description
        const updateRole: Role = await this._roleRepository.save(foundRole);
        return plainToClass(ReadRoleDto, updateRole);
    }

    async delete(id: number): Promise<void> {
        const roleExist: Role = await this._roleRepository.findOne(id, { where: { status: StatusConfig.ACTIVO } });
        if (!roleExist) throw new NotFoundException('id No Enviado');
        await this._roleRepository.update(id, { status: StatusConfig.INACTIVO });
    }

}