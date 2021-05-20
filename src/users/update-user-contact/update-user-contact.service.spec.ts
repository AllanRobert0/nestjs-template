import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserContactService } from './update-user-contact.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UserDataDto } from '../../auth/dtos/user-data.dto';
import { RequestUpdateUserContact } from '../dtos/request-update-user-contact';
import { NotFoundException } from '@nestjs/common';

describe('UpdateUserContactService test suit', () => {
  let service;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserContactService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({ save: jest.fn(), findOne: jest.fn() }),
        },
      ],
    }).compile();

    service = module.get<UpdateUserContactService>(UpdateUserContactService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update user contact successfully', async () => {
    const mockDtoUser: UserDataDto = {
      id: '1',
      name: 'teste',
      email: 'teste@teste.com',
      telephone: '123456789010',
      advertisements: [],
    };

    const mockDatabaseUser = {
      id: '1',
      email: 'teste@teste.com',
      name: 'teste',
      password: 'teste123',
      telephone: '12345612121',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockContactInfo: RequestUpdateUserContact = {
      email: 'teste2@gmail.com',
      telephone: '10987654321',
    };

    userRepository.findOne.mockReturnValue(mockDatabaseUser);

    await service.execute(mockContactInfo, mockDtoUser);

    expect(userRepository.save).toBeCalledTimes(1);
    expect(userRepository.save).toBeCalledWith({
      ...mockDatabaseUser,
      email: mockContactInfo.email,
      telephone: mockContactInfo.telephone,
    });
  });

  it('should return error if the given user is not in the database', async () => {
    const mockDtoUser: UserDataDto = {
      id: '1',
      name: 'teste',
      email: 'teste@teste.com',
      telephone: '123456789010',
      advertisements: [],
    };

    const mockContactInfo: RequestUpdateUserContact = {
      email: 'teste2@gmail.com',
      telephone: '10987654321',
    };

    userRepository.findOne.mockReturnValue(undefined);

    await expect(service.execute(mockContactInfo, mockDtoUser)).rejects.toThrow(
      NotFoundException,
    );
  });
});
