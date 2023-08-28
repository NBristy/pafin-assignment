import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserRequestDto, UpdateUserResponseDto } from './user.dto';
import { User } from '../entity/user.entity';
import { HttpStatus, HttpException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('getProfile', () => {
    it('should get the profile of a user', async () => {
      const userId = 'user-id';
      const mockUser: User = new User();
      mockUser.id = userId;
      mockUser.name = 'Mock User';
      mockUser.email = 'mock@example.com';

      jest.spyOn(userService, 'findById').mockResolvedValue(mockUser);

      const result: User = await userController.getProfile(userId);

      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'newPassword',
      };
      const createdUser: User = new User();
      createdUser.id = 'created-user-id';
      createdUser.name = 'New User';
      createdUser.email = 'new@example.com';
      createdUser.password = 'newPassword';

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result: User = await userController.createUser(createUserDto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('update', () => {
    it('should update a user and return updated information', async () => {
      const userId = 'user-id';
      const updateUserDto: UpdateUserRequestDto = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newPassword',
      };
      const updatedUser: User = new User();
      updatedUser.id = userId;
      updatedUser.name = 'Updated User';
      updatedUser.email = 'updated@example.com';
      updatedUser.password = 'newPassword';

      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      const result: UpdateUserResponseDto = await userController.update(userId, updateUserDto);

      expect(result).toEqual(plainToClass(UpdateUserResponseDto, updatedUser));
    });
  });

  describe('remove', () => {
    it('should remove a user and return success message', async () => {
      const userId = 'user-id';

      jest.spyOn(userService, 'remove').mockResolvedValue();

      const result = await userController.remove(userId);

      expect(result).toEqual({ message: 'User removed successfully.' });
    });

    it('should catch error when removing a user fails', async () => {
      const userId = 'user-id';

      const error = new HttpException('An error occurred while removing the user.', HttpStatus.INTERNAL_SERVER_ERROR);
      jest.spyOn(userService, 'remove').mockRejectedValue(error);

      const result = await userController.remove(userId);

      expect(result).toEqual({ message: 'An error occurred while removing the user.' });
    });
  });
});
