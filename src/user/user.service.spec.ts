import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from '../entity/user.entity';
import { CreateUserDto } from './user.dto';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  //Tester for create user
  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Passw0rd123',
      };

      const expectedUser = new User();
      expectedUser.id = 'mocked-id';
      expectedUser.name = createUserDto.name;
      expectedUser.email = createUserDto.email;

      userRepository.findOne = jest.fn().mockResolvedValue(undefined);
      userRepository.create = jest.fn().mockReturnValue(expectedUser);
      userRepository.save = jest.fn().mockResolvedValue(expectedUser);

      const result = await userService.create(createUserDto);
      expect(result).toEqual(plainToClass(User, expectedUser));
    });

    it('should throw an exception if user with the same email already exists', async () => {
      const existingUser = new User();
      existingUser.id = 'existing-id';
      existingUser.name = 'Existing User';
      existingUser.email = 'test@example.com';
      existingUser.password = 'hashedpassword';

      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Passw0rd123',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(existingUser);

      try {
        await userService.create(createUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toEqual('Email already exists');
        expect(error.status).toEqual(HttpStatus.CONFLICT);
      }
    });
  });

  //Tester for update user
  describe('update', () => {
    it('should update user data', async () => {
      const existingUser = new User();
      existingUser.id = 'user-id';
      existingUser.name = 'Existing User';
      existingUser.email = 'existing@example.com';
      existingUser.password = 'hashedpassword';

      const updatedData = {
        name: 'Updated Name',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(existingUser);
      userRepository.save = jest.fn().mockResolvedValue({
        ...existingUser,
        ...updatedData,
      });

      const result = await userService.update('user-id', updatedData);
      expect(result).toEqual(plainToClass(User, { ...existingUser, ...updatedData }));
    });

    it('should throw an exception if user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      try {
        await userService.update('nonexistent-id', {});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toEqual('User not found');
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });

    it('should update password', async () => {
      const existingUser = new User();
      existingUser.id = 'user-id';
      existingUser.name = 'Existing User';
      existingUser.email = 'existing@example.com';
      existingUser.password = 'hashedpassword';

      const updatedData = {
        password: 'newPassw0rd',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(existingUser);
      userRepository.save = jest.fn().mockResolvedValue({
        ...existingUser,
        password: await bcrypt.hash(updatedData.password, 10),
      });

      const result = await userService.update('user-id', updatedData);
      expect(result).toBeDefined();
      expect(result.password).not.toBe(existingUser.password);

    });

    it('should throw an exception for email conflict', async () => {
      const existingUser = new User();
      existingUser.id = 'user-id';
      existingUser.name = 'Existing User';
      existingUser.email = 'existing@example.com';
      existingUser.password = 'hashedpassword';

      const updatedData = {
        email: 'existing@example.com',
      };

      userRepository.findOne = jest.fn().mockResolvedValue(existingUser);
      userService.findByEmail = jest.fn().mockResolvedValue(existingUser);

      try {
        await userService.update('user-id', updatedData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toEqual('Email already exists');
        expect(error.status).toEqual(HttpStatus.CONFLICT);
      }
    });
  });

  //Tester for get user
  describe('findById', () => {
    it('should find and return a user', async () => {
      const mockUserId = 'mocked-user-id';
      const mockUser: User = new User();
      mockUser.id = mockUserId;
      mockUser.name = 'Mock User';
      mockUser.email = 'mock@example.com';
      mockUser.password = 'hashedpassword';

      const options: FindOneOptions<User> = {
        where: { id: mockUserId },
      };

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userService.findById(mockUserId);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith(options);
    });

    it('should throw an exception if user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      try {
        await userService.findById('nonexistent-id');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toEqual('User not found');
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });

  //Tester for delete user
  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUserId = 'mocked-user-id';
      const mockUser: User = new User();
      mockUser.id = mockUserId;
      mockUser.name = 'Mock User';
      mockUser.email = 'mock@example.com';
      mockUser.password = 'hashedpassword';

      userRepository.findOne = jest.fn().mockResolvedValue(mockUser);
      userRepository.remove = jest.fn().mockResolvedValue(undefined);

      await userService.remove(mockUserId);
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an exception if user is not found', async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(undefined);

      try {
        await userService.remove('nonexistent-id');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response).toEqual('User not found');
        expect(error.status).toEqual(HttpStatus.NOT_FOUND);
      }
    });
  });
});