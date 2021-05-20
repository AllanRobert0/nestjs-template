import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UpdateUserPasswordService } from './update-user-password.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UpdateUserPasswordService test suit', () => {
  let service;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserPasswordService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({ save: jest.fn(), findOne: jest.fn() }),
        },
      ],
    }).compile();

    service = module.get<UpdateUserPasswordService>(UpdateUserPasswordService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return bad request as the given passwords do not match', async () => {
    const mockWrongParams = {
      password: 'teste123',
      passwordConfirmation: 'teste1234',
    };

    await expect(service.execute(mockWrongParams)).rejects.toThrow(
      new BadRequestException('As senhas devem ser iguais'),
    );
  });

  it('should return not found as the user was not found in the database', async () => {
    const mockParams = {
      password: 'teste123',
      passwordConfirmation: 'teste123',
    };

    userRepository.findOne.mockReturnValue(undefined);

    await expect(service.execute(mockParams)).rejects.toThrow(
      new NotFoundException('Usuário não encontrado'),
    );

    expect(userRepository.findOne).toBeCalledTimes(1);
  });

  it('should save user successfully in the database', async () => {
    const mockParams = {
      password: 'teste123',
      passwordConfirmation: 'teste123',
    };

    const mockFindOneReturn = {
      id: '2',
      password: '123456',
    };

    userRepository.findOne.mockReturnValue(mockFindOneReturn);
    userRepository.save.mockReturnValue(undefined);

    await service.execute(mockParams);
    expect(userRepository.findOne).toBeCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith({
      ...mockFindOneReturn,
      password: mockParams.password,
    });
  });
});
