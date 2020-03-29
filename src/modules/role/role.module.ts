import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';

@Module({
    imports: [TypeOrmModule.forFeature([RoleRepository])],
})
export class RoleModule { }
