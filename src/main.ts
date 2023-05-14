import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe(),
  );

  const config = new DocumentBuilder()
    .setTitle('Documentos Api')
    .setDescription(
      'Esta es una api para guardar documentos. \n' + 
      'Diferentes funciones requeriran autorizacion, para acceder se debe iniciar sesion con el metodo login y ' +
      'luego de tener el jwt dar click en el boton de arriba a la derecha que dice "Authorize", poner el jwt y dar click en authorize. '+
      'luego ya se podra acceder a los demas metodos sin problema.'
    )
    .setVersion('1.0')
    .addTag('documentos')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
