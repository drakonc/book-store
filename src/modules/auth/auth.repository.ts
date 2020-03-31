import { EntityRepository, Repository, getConnection } from 'typeorm';
import { genSalt, hash } from 'bcryptjs'
import { User } from '../user/user.entity';
import { SignupDto } from './dto';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UserDetails } from '../user/user.details.entity';


@EntityRepository(User)
export class AuthRepository extends Repository<User> {

    async signup(signupDto: SignupDto) { //Funcion para Regustrar Usuarios
        const { username, email, password } = signupDto;
        const user = new User();
        user.username = username;
        user.email = email;

        //Se Busca en la Base de Datos El Rol General y se leInserta al usuario
        const _roleRepository: RoleRepository = await getConnection().getRepository(Role);
        const defaulRole: Role = await _roleRepository.findOne({ where: { name: RoleType.GENERAL } })
        user.roles = [defaulRole];

        const details = new UserDetails();
        user.details = details;

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        user.save();

    }

}
