import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfirmUserService } from './confirm-user.service';
import { BadRequestException } from '@nestjs/common';
import { JWT_ERRORS } from '../../utils/jwt.utils';

describe('ConfirmUserService test suit', () => {
  let service;
  let userRepository;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfirmUserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({
            save: jest.fn(),
            create: jest.fn(),
            findOne: jest.fn(),
          }),
        },
        {
          provide: JwtService,
          useFactory: () => ({
            verifyAsync: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ConfirmUserService>(ConfirmUserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Execute test suit', () => {
    it('should save user successfully in the database', async () => {
      const userMock = { id: '1' };
      const paramMock = 'token';

      service.verifyToken = jest.fn().mockReturnValue(userMock);
      userRepository.findOne.mockReturnValue(userMock);

      await service.execute(paramMock);

      expect(service.verifyToken).toHaveBeenCalledWith(paramMock);
      expect(userRepository.findOne).toHaveBeenCalledWith(userMock.id);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...userMock,
        active: true,
      });
    });
  });

  describe('verifyToken test suit', () => {
    it('should return expired error', async () => {
      const errorExpired = new Error();
      errorExpired.name = 'TokenExpiredError';
      jwtService.verifyAsync.mockRejectedValue(errorExpired);

      await expect(service.verifyToken('token')).rejects.toThrow(
        new BadRequestException(JWT_ERRORS.get('TokenExpiredError')),
      );
    });

    it('should return "error validating link"', async () => {
      const errorExpired = new Error();
      errorExpired.name = 'JsonWebTokenError';
      jwtService.verifyAsync.mockRejectedValue(errorExpired);

      await expect(service.verifyToken('token')).rejects.toThrow(
        new BadRequestException(JWT_ERRORS.get('JsonWebTokenError')),
      );
    });

    it('should return generic error', async () => {
      const errorExpired = new Error();
      jwtService.verifyAsync.mockRejectedValue(errorExpired);

      await expect(service.verifyToken('token')).rejects.toThrow(
        new BadRequestException('Algo deu errado, tente novamente mais tarde'),
      );
    });
  });
});
