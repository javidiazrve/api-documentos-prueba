import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              uri: `mongodb+srv://${configService.get<string>('MONGO_USER')}:${configService.get<string>('MONGO_PASSWORD')}@api-documents.oni8jih.mongodb.net/api?retryWrites=true&w=majority`  
            }),
            inject: [ConfigService]
        }),
    ],
    exports: [MongooseModule]
})
export class DatabaseModule {}
