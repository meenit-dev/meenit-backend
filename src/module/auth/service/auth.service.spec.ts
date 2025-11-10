import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(jwtService).toBeDefined();
  });
});
