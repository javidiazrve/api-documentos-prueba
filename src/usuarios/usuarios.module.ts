import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuariosController } from 'src/usuarios/usuarios.controller';
import { User, UserSchema } from 'src/database/schemas/usuario.schema';
import { UsuariosService } from './usuarios.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secretOrKeyProvider: () => configService.get('JWT_SECRET_KEY'),
                signOptions: {
                    expiresIn: '60m',
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UsuariosController],
    providers: [UsuariosService],
    exports: [UsuariosService]
})
export class UsuariosModule {}
