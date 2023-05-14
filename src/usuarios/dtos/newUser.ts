import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NewUserDto{

    @ApiProperty({required: true, description: "Username con el que se autenticará el usuario."})
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({required: true, description: "Contraseña del usuario."})
    @IsString()
    @IsNotEmpty()
    password: string;

}