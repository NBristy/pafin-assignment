import { Controller, Get, Put, Delete, Body, Param, UseGuards, Post, ValidationPipe, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserRequestDto, UpdateUserResponseDto } from './user.dto';
import { User } from '../entity/user.entity';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get logged in user information' })
  async getProfile(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id); 
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a user' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {
    const updatedInfo = this.userService.update(id, updateUserDto);
    return plainToClass(UpdateUserResponseDto, updatedInfo);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.userService.remove(id);
      return { message: 'User removed successfully.' };
    } catch (error) {
      return { message: 'An error occurred while removing the user.' };
    }
  }
}
