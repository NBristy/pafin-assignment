import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Naima Akter' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'naima@example.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 'Passw0rd123' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must contain at least 1 letter, 1 number and eight characters long',
  })
  password: string;
}

export class UpdateUserRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Naima Akter' })
  name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'naima@example.com' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Passw0rd$123' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must contain at least 1 letter, 1 number and eight characters long',
  })
  password: string;
}

export class UpdateUserResponseDto {
  name: string;
  email: string;

  @Exclude()
  id: string;
  
  @Exclude()
  password: string;
}
