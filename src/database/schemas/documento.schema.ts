import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DocumentoDocument = HydratedDocument<Documento>;

@Schema({toJSON: {
  transform(doc, ret,) {
      delete ret.__v;
  },
}})
export class Documento {
  @Prop()
  filename: string;

  @Prop()
  fechaSubida: Date;

  @Prop()
  linkDescarga: string;

  @Prop()
  owner: string;

  @Prop()
  tipo: string;

  @Prop()
  descripcion: string;

  @Prop()
  usuariosRelacionados: string[];
}



export const DocumentoSchema = SchemaFactory.createForClass(Documento);
