import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { NewUserDto } from './dtos/newUser';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/database/schemas/usuario.schema';
import { Model } from 'mongoose';
import { UserCredentials } from './dtos/userCredentials';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        ){}

    async createNewUser(newUser: NewUserDto): Promise<any>{

        const usedUser = await this.findByUsername(newUser.username); 

        if(usedUser) throw new HttpException("Username already taken.", HttpStatus.BAD_REQUEST);

        newUser.password = await bcrypt.hash(newUser.password, 10);

        await this.userModel.create(newUser);

        return {
            ok: true
        };
    }

    async login(credentials: UserCredentials): Promise<any>{

        const user = await this.findByUsername(credentials.username);
        
        if(!user) throw new HttpException("Username o Password Incorrecto.", HttpStatus.BAD_REQUEST);
        
        const correctPassword = await bcrypt.compare(credentials.password, user.password);

        if(!correctPassword) throw new HttpException("Username o Password Incorrecto.", HttpStatus.BAD_REQUEST);

        const jwt = await this.jwtService.signAsync({username: user.username})
        
        return {
            jwt
        }
    }

    async findByUsername(username: string){
 
        return await this.userModel.findOne({username});

    }
}
