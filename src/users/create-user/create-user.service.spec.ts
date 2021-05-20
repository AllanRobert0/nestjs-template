import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserService } from './create-user.service';
import { MailerModule } from '../../mailer/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RequestCreateUserDto } from '../dtos/request-create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

describe('CreateUserService test suit', () => {
  let service;
  let userRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        { module: MailerModule, imports: [ConfigModule] },
        ConfigModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            return {
              secret: configService.get('JWT_SECRET'),
              signOptions: {
                expiresIn: configService.get('EXPIRES_IN'),
              },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [
        CreateUserService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: () => ({
            save: jest.fn(),
            create: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save user successfully, send email and return confirmation message', async () => {
    const mockUser: RequestCreateUserDto = {
      email: 'teste@tes.com',
      name: 'teste',
      password: 'teste123',
      telephone: '12345612121',
    };
    userRepository.create.mockReturnValue({
      ...mockUser,
      id: '1',
      password: await hash(mockUser.password, await genSalt(12)),
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    userRepository.save.mockReturnValue({
      ...mockUser,
      id: '1',
      password: await hash(mockUser.password, await genSalt(12)),
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    service.findUserByEmailOrTelephone = jest.fn().mockReturnValue(undefined);
    service.sendConfirmationMail = jest.fn().mockReturnValue(undefined);

    const expected = {
      message: 'Confirme sua conta clicando no link enviado ao seu e-mail!',
    };

    const result = await service.execute(mockUser);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(service.findUserByEmailOrTelephone).toHaveBeenCalledTimes(1);
    expect(service.sendConfirmationMail).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expected);
  });

  it('should return error if the user is already registered', async () => {
    const mockDatabaseUser = {
      id: '1',
      email: 'teste@tes.com',
      name: 'teste',
      password: 'teste123',
      telephone: '12345612121',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockDtoUser = {
      email: 'teste@tes.com',
      name: 'teste',
      password: 'teste123',
      telephone: '12345612121',
    };

    service.findUserByEmailOrTelephone = jest
      .fn()
      .mockReturnValue(mockDatabaseUser);

    await expect(service.execute(mockDtoUser)).rejects.toThrow(
      BadRequestException,
    );
  });
});
