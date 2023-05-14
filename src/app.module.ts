import { JwtModule, JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { MulterModule } from '@nestjs/platform-express';

import { DocumentosModule } from './documentos/documentos.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MulterModule.register({
      dest: './upload',
    }),
    DocumentosModule,
    UsuariosModule
  ],
})
export class AppModule {}
