import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileInfoDto } from './dtos/fileInfo';
import { Documento } from 'src/database/schemas/documento.schema';
import * as fs from 'fs';
import { InfoActualizarDto } from './dtos/InfoActualizar';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class DocumentosService {

    constructor(@InjectModel(Documento.name) private documentoModel: Model<Documento>, private userService: UsuariosService){}

    async getDocuments(query: any){
        
        try {
            return this.documentoModel.find(query);
        } catch (error) {
            this.handleError(error);
        }

    }

    async getDocumentById(docId: string){

        try {
            const doc = await this.documentoModel.findById(docId);

            return doc.toJSON();
        } catch (error) {
            this.handleError(error);
        }

    }
    
    async guardarDocumento(file: Express.Multer.File, infoFile: FileInfoDto){

        try {
            
            if(!file) throw new HttpException("El file es necesario", HttpStatus.BAD_REQUEST);

            const owner = await this.userService.findByUsername(infoFile.owner);

            if(!owner) throw "invalidUsername";

            const docInterface: DocumentoInterface = {
                filename: file.originalname,
                fechaSubida: new Date(),
                linkDescarga: `http://localhost:3000/documentos/download/${file.filename}`,
                usuariosRelacionados: [],
                ...infoFile
            }
            
            const resDB = await this.documentoModel.create(docInterface);
            
            return resDB.toJSON();

        } catch (error) {

            this.handleError(error);
        }
 
    }

    async getDocumentUrl(filename: string){
        const path = 'uploads/' + filename;
        const exists = fs.existsSync(path);
        
        if(exists){
            return path;
        }else{
            throw new HttpException("File no encontrado", HttpStatus.BAD_REQUEST);
        }
    }

    async actualizarDocumento(docId: string, infoActualizar: InfoActualizarDto){

        try {

            if(infoActualizar.owner){
                const user = await this.userService.findByUsername(infoActualizar.owner);
                if(!user) throw "invalidUsername";
            }

            const doc = await this.documentoModel.findByIdAndUpdate(docId, {$set: {
                ...infoActualizar
            }},{new: true });

            if(!doc) throw "docId";
            
            return doc;
        } catch (error) {
            
            this.handleError(error);
        }
    }

    async assignUserToDocument(docId: string, username: string){

        try {

            const user = await this.userService.findByUsername(username);

            if(!user) throw "invalidUsername";

            let doc = await this.documentoModel.findById(docId);

            if(doc.usuariosRelacionados.find((value) => value === username)) throw "userAlreadyIn";

            doc = await this.documentoModel.findByIdAndUpdate(docId, {$push: {
                usuariosRelacionados: username,
            }}, {new: true});

            return doc;
        } catch (error) {
        
            this.handleError(error);
        }

    }

    async eliminarDocumento(docId: string){

        try {
            const doc = await this.documentoModel.findByIdAndRemove(docId);

            if(!doc) throw "docId";

            if(fs.existsSync('uploads/' + doc.filename)){
                fs.unlinkSync('uploads/' + doc.filename);
            }

            return {
                ok: true,
                message: "Documento eliminado"
            }
        } catch (error) {
            
            this.handleError(error);
        }

    }

    handleError(error: any){
        
        if(error.kind === "ObjectId" || error === "docId") throw new HttpException("No hay documentos con ese id.", HttpStatus.BAD_REQUEST);

        if(error === "invalidUsername") throw new HttpException("No existe un usuario con ese username.", HttpStatus.BAD_REQUEST);

        if(error === "userAlreadyIn") throw new HttpException("Este usuario ya esta asignado al documento.", HttpStatus.BAD_REQUEST);

        throw new HttpException("Paso algo inesperado, Intente mas tarde.", HttpStatus.SERVICE_UNAVAILABLE);
    }

}

class DocumentoInterface {

    filename: string;
    linkDescarga: string;
    owner: string;
    tipo: string;
    descripcion?: string;
    fechaSubida: Date;
    usuariosRelacionados: string[];
}
