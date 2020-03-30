import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';

@Controller('roles')
export class RoleController {

    constructor(private readonly _roleService: RoleService) { }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<Role> {
        const role: Role = await this._roleService.get(id);
        return role;
    }

    @Get()
    async getUsers(): Promise<Role[]> {
        const role: Role[] = await this._roleService.getAll();
        return role;
    }

    @Post()
    async createRole(@Body() role: Role): Promise<Role> {
        const createdRole = await this._roleService.create(role);
        return createdRole;
    }

    @Patch(':id')
    async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role): Promise<Boolean> {
        await this._roleService.update(id, role);
        return true;
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseIntPipe) id: number): Promise<Boolean> {
        await this._roleService.delete(id);
        return true;
    }
}