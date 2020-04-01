import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { SignupDto, SigninDto, LoggedInDto } from './dto';
import { User } from '../user/user.entity';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(AuthRepository) private readonly _authRepository: AuthRepository, private readonly _jwtService: JwtService) { }

    async signup(signupDTO: SignupDto): Promise<void> {
        const { username, email } = signupDTO;
        const userExists = await this._authRepository.findOne({ where: [{ username }, { email }] })

        if (userExists) throw new ConflictException('El Usuario o el Correo Electronico Existen');

        return this._authRepository.signup(signupDTO);
    }

    async signin(signinDto: SigninDto): Promise<LoggedInDto> {

        const { username, password } = signinDto;
        const user: User = await this._authRepository.findOne({ where: { username } });

        if (!user) throw new NotFoundException('Usuario No Existe');

        const isMatch = await compare(password, user.password);

        if (!isMatch) throw new UnauthorizedException('Contraseña Invalida')

        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(r => r.name as RoleType),
        }

        const token = this._jwtService.sign(payload)

        return plainToClass(LoggedInDto, { token, user });

    }
}
