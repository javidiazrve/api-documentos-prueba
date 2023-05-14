import { Body, Controller, Post, Put } from '@nestjs/common';
import { NewUserDto } from './dtos/newUser';
import { UsuariosService } from './usuarios.service';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserCredentials } from './dtos/userCredentials';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {

    constructor(private usuariosService: UsuariosService){}

    @Post('/crear')
    @ApiBody({
        description: "Crear Usuario",
        type: NewUserDto,
    })
    @ApiOperation({summary: "Create New Users", description: "Crear nuevos usuarios suministrando un username y contraseña."})
    async createNewUser(@Body() newUserDto: NewUserDto){

        return this.usuariosService.createNewUser(newUserDto);
        
    }

    @Put('/login')
    @ApiOperation({summary: "Login", description: "Iniciar sesion con username y contraseña. Devuelve el JWT para autenticarse y acceder a las funciones que lo requieran."})
    @ApiBody({
        description: "Autenticacion de usuarios (Login)",
        type: UserCredentials
    })
    async login(@Body() credentials: UserCredentials){

        return await this.usuariosService.login(credentials);

    }
    

}
