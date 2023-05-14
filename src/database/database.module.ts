import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/api-documentos'),
    ],
    exports: [MongooseModule]
})
export class DatabaseModule {}
