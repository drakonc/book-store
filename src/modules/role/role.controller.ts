import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe, Req } from '@nestjs/common';
import { RoleService } from './role.service';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RoleController {

    constructor(private readonly _roleService: RoleService) { }

    @Get(':roleId')
    getUser(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto> {
        return this._roleService.get(roleId);
    }

    @Get()
    getUsers(@Req() req): Promise<ReadRoleDto[]> {
        return this._roleService.getAll();
    }

    @Post()
    createRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        return this._roleService.create(role);
    }

    @Patch(':roleId')
    updateRole(@Param('roleId', ParseIntPipe) roleId: number, @Body() role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
        return this._roleService.update(roleId, role);
    }

    @Delete(':roleId')
    async deleteRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<Boolean> {
        await this._roleService.delete(roleId);
        return true;
    }
}