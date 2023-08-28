import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    generateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {};

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.generateToken.mockResolvedValue({ access_token: 'mock-token' });

      const result = await authController.login(loginDto);
      expect(result).toEqual({ access_token: 'mock-token' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockAuthService.generateToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw HttpException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'invalidPassword',
      };

      mockAuthService.validateUser.mockResolvedValue(null);

      try {
        await authController.login(loginDto);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toEqual('Invalid credentials');
        expect(error.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
      }
    });
  });
});
