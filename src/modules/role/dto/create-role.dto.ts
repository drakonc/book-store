import { IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {

    @IsString()
    @MaxLength(50, { message: 'Este Nombre No Es Valido' })
    readonly name: string;

    @IsString()
    @MaxLength(100, { message: 'Este Descripción No Es Validoo' })
    readonly description: string;

}