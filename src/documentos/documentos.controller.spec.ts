import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosController } from './documentos.controller';
import { AppModule } from '../app.module';

describe('DocumentosController', () => {
  let controller: DocumentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<DocumentosController>(DocumentosController);
  });

});

