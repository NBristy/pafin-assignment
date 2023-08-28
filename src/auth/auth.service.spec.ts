import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const mockUser: User = new User();
      mockUser.id = 'user-id';
      mockUser.name = 'Test User';
      mockUser.email = email;
      mockUser.password = hashedPassword;

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'invalidPassword';

      const mockUser: User = new User();
      mockUser.id = 'user-id';
      mockUser.name = 'Test User';
      mockUser.email = email;
      mockUser.password = 'hashedpassword';

      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should generate an access token', async () => {
      const mockUser: User = new User();
      mockUser.id = 'user-id';
      mockUser.name = 'Test User';
      mockUser.email = 'test@example.com';

      const mockToken = 'mock-access-token';
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await authService.generateToken(mockUser);
      expect(result.access_token).toEqual(mockToken);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({ sub: mockUser.id, email: mockUser.email });
    });
  });

});
