import { IsString, IsEmail, MaxLength } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @MaxLength(15, { message: 'Este Username No Es Valido' })
    readonly username: string;
}