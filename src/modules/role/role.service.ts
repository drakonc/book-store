import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';
import { StatusConfig } from '../../shared/config.status';

@Injectable()
export class RoleService {

    constructor(@InjectRepository(RoleRepository) private readonly _roleRepository: RoleRepository) { }

    async get(id: number): Promise<Role> {
        if (!id) throw new BadRequestException('id No Enviado');
        const role: Role = await this._roleRepository.findOne(id);
        if (!role) throw new NotFoundException();
        return role;
    }

    async getAll(): Promise<Role[]> {
        /*const par: number = 1
        const p = await this._roleRepository.query("Select * from roles where id = $1", [par]);
        console.log(p[0]);*/
        const roles: Role[] = await this._roleRepository.find({ where: { status: StatusConfig.ACTIVO } });
        return roles;

    }

    async create(role: Role): Promise<Role> {
        const saveRoles: Role = await this._roleRepository.save(role);
        return saveRoles;
    }

    async update(id: number, role: Role): Promise<void> {
        await this._roleRepository.update(id, role);
    }

    async delete(id: number): Promise<void> {
        const roleExist: Role = await this._roleRepository.findOne(id, { where: { status: StatusConfig.ACTIVO } });
        if (!roleExist) throw new BadRequestException('id No Enviado');
        await this._roleRepository.update(id, { status: StatusConfig.INACTIVO });
    }

}