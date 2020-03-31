import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from '../role/roletype.enum'
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { ReadUserDto, UpdateUserDto } from './dto';


@Controller('users')
export class UserController {

    constructor(private readonly _userService: UserService) { }

    @Get(':id')
    @Roles(RoleType.ADMIN, RoleType.AUTHOR)
    @UseGuards(AuthGuard(), RoleGuard)
    getUser(@Param('id', ParseIntPipe) userId: number): Promise<ReadUserDto> {
        return this._userService.get(userId);
    }

    @Get()
    //@UseGuards(AuthGuard())
    getUsers(): Promise<ReadUserDto[]> {
        return this._userService.getAll();
    }

    @Patch(':userId')
    updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() user: Partial<UpdateUserDto>): Promise<ReadUserDto> {
        return this._userService.update(userId, user);
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this._userService.delete(id);
    }

    @Post('/setRole/:userId/:roleId')
    seteRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) rolesId: number): Promise<Boolean> {
        return this._userService.setRoleToUser(userId, rolesId);
    }
}
