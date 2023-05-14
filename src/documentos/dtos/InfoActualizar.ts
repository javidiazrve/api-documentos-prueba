import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class InfoActualizarDto{

    @ApiProperty({description: "Username del usuario dueño del documento."})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    owner: string;

    @ApiProperty({ enum: ['Publico', 'Privado', 'Draft'], description: "Tipo de archivo."})
    @IsString()
    @IsOptional()
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