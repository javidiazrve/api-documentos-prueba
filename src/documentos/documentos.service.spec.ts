import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosService } from './documentos.service';
import { DocumentosModule } from './documentos.module';

describe('DocumentosService', () => {
  let service: DocumentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentosService],
      imports: [DocumentosModule]
    }).compile();

    service = module.get<DocumentosService>(DocumentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
