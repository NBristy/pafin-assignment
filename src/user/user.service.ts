import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { FindOneOptions } from 'typeorm';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const options: FindOneOptions<User> = {
      where: { id },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const options: FindOneOptions<User> = {
      where: { email },
    };
    return this.userRepository.findOne(options);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (data.email) {
      if (data.email == user.email) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      } else {
        const existingUser = await this.findByEmail(data.email);
        if (existingUser) {
          throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }
      }
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.remove(user);
  }

  async create(data: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }
}
