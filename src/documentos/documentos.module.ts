import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentosController } from 'src/documentos/documentos.controller';
import { Documento, DocumentoSchema } from 'src/database/schemas/documento.schema';
import { DocumentosService } from './documentos.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
    imports: [
        UsuariosModule,
        MongooseModule.forFeature([{ name: Documento.name, schema: DocumentoSchema }]),
    ],
    controllers: [DocumentosController],
    providers: [DocumentosService, JwtService]
})
export class DocumentosModule {}
