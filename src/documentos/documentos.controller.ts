/* eslint-disable prefer-const */
import { FileInfoDto } from './dtos/fileInfo';
import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, UseGuards, Put, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DocumentosService } from './documentos.service';
import { AuthGuard } from 'src/guards/authGuard';
import { InfoActualizarDto } from './dtos/InfoActualizar';


@ApiTags('documentos')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('documentos')
export class DocumentosController {
    
    constructor(private documentosService: DocumentosService){}

    @Get()
    @ApiOperation({ summary: 'Get All Documents',description: "Obtiene la informacion de todos los documentos. (Requiere autenticación)." })
    @ApiQuery({name: "filename", type: String, description: "Busca los archivos por el nombre del archivo.", required: false})
    @ApiQuery({name: "owner", type: String, description: "Busca los archivos por el username del owner.", required: false})
    @ApiQuery({name: "fechaSubida", type: String, description: "Busca los archivos por la fecha. Formato: (año-mes-dia). Ejemplo: 2023-05-14", required: false,})
    async getDocuments(@Query("filename") filename: string, @Query("owner") owner: string, @Query("fechaSubida") fechaSubida: string){

        const query = this.buildQuery(filename, owner, fechaSubida);
        
        return this.documentosService.getDocuments(query);
    }

    @Get('/:docId')
    @ApiOperation({ summary: 'Get Document By id',description: "Obtiene la informacion de un documento suministrando su id. (Requiere autenticación)." })
    @ApiParam({
        name: "docId",
        description: "El id del documento a buscar.",
        allowEmptyValue: false,
        type: String
    })
    async getDocumentById(@Param('docId') docId: string){
        return this.documentosService.getDocumentById(docId);
    }

    @Get("download/:filename")
    @ApiOperation({ summary: 'Get Document Download Url',description: "Obtiene el url de descarga de un documento suministrando su nombre. (Requiere autenticación)." })
    @ApiParam({
        name: "filename",
        description: "El nombre del archivo.",
        allowEmptyValue: false,
        type: String
    })
    async downloadDocument(@Param('filename') filename: string, @Res() resp: Response){
        
        const path = await this.documentosService.getDocumentUrl(filename);

        return resp.download(path); 
    }

    @Post()
    @ApiOperation({ summary: 'Create New Document',description: "Crea un nuevo documento. (Requiere autenticación)." })
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb)=>{
                cb(null, `${file.originalname}`);
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: "Crear Documento",
        type: FileInfoDto,
    })
    async createDocument(@UploadedFile() file, @Body() infoFile: FileInfoDto){
        
        return await this.documentosService.guardarDocumento(file, infoFile);

    }

    @Put('asignarUsuario/:docId/:username')
    @ApiOperation({ summary: 'Assign User To Document',description: "Se le asigna un usuario al documento o viceversa. (Requiere autenticación)." })
    @ApiParam({
        name: "docId",
        description: "El id del documento a actualizar.",
        allowEmptyValue: false,
        type: String
    })
    @ApiParam({
        name: "username",
        description: "El username del usuario que se quiere asignar al documento.",
        allowEmptyValue: false,
        type: String
    })
    async assignUserToDocument(@Param('docId') docId: string, @Param('username') username: string){
        return await this.documentosService.assignUserToDocument(docId, username);
    }

    @Put('actualizar/:docId')
    @ApiOperation({ summary: 'Update Document',description: "Actualiza un documento suministrando su id. (Requiere autenticación)." })
    @ApiParam({
        name: "docId",
        description: "El id del documento a actualizar.",
        allowEmptyValue: false,
        type: String
    })
    async updateDocument(@Param('docId') docId: string, @Body() infoActualizar: InfoActualizarDto){
        return await this.documentosService.actualizarDocumento(docId, infoActualizar);
    }

    @Put('eliminar/:docId')
    @ApiOperation({ summary: 'Delete Document',description: "Elimina un nuevo documento suministrando su id. (Requiere autenticación)." })
    @ApiParam({
        name: "docId",
        description: "El id del documento a eliminar.",
        allowEmptyValue: false,
        type: String
    })
    async deleteDocument(@Param('docId') docId: string){
        
        return await this.documentosService.eliminarDocumento(docId);
    }

    // UTILS

    buildQuery(filename, owner, fechaSubida){
        let query = {};

        if(filename) query["filename"] = {"$regex": filename};
        
        if(owner) query["owner"] = owner;

        if(fechaSubida){
            const fecha = new Date(fechaSubida);
            query["fechaSubida"] = {"$gt" : fecha, "$lt": new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 44)}
        } 

        return query;
    }

}
