import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FileInfoDto{

    @ApiProperty({ type: 'string', format: 'binary' , description: "Archivo a guardar."})
    file: any;

    @ApiProperty({description: "Username del usuario dueño del documento."})
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({ enum: ['Publico', 'Privado', 'Draft'], description: "Tipo de archivo."})
    @IsString()
    @IsNotEmpty()
    tipo: UserRole;

    @ApiProperty({required: false, description: "Descripcion del archivo. (Opcional)"})
    @IsOptional()
    @IsString()
    descripcion?: string;

}

export enum UserRole {
    Publico = 'Publico',
    Privado = 'Privado',
    Draft = 'Draft',
}