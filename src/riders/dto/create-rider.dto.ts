import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';

export class CreateRiderDto {
  @ApiProperty({ example: 'John', description: 'First name of the rider' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the rider' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'Doe@gmail.com', description: 'Email of the rider' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'ABCD123',
    description: 'License plate of the rider',
  })
  @IsNotEmpty()
  @IsString()
  @Length(4, 10)
  licensePlate: string;

  @ApiProperty({
    example: '0812345678',
    description: 'Phone number of the rider',
  })
  @IsNotEmpty()
  @Matches(/^[0-9]{9,10}$/, { message: 'Phone number must be 9 or 10 digits' })
  phoneNumber: string;
}
