import { IsString, IsNumber, IsEmail } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadUserDetailsDto } from './read-user-details.dto';
import { ReadRoleDto } from '../../role/dto/';

@Exclude()
export class ReadUserDto {

    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    readonly username: string;

    @Expose()
    @IsEmail()
    readonly email: string;

    @Expose()
    @Type(type => ReadRoleDto)
    readonly details: ReadUserDetailsDto;

    @Expose()
    @Type(type => ReadRoleDto)
    readonly roles: ReadRoleDto[];

}
