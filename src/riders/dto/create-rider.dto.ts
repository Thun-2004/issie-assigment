import { ApiProperty } from '@nestjs/swagger';

export class CreateRiderDto {
    // @ApiProperty({ example: 1, description: 'ID of the rider' })
    // id: number; 

    @ApiProperty({ example: 'John', description: 'First name of the rider' })
    firstname: string;

    @ApiProperty({ example: 'Doe', description: 'Last name of the rider' })
    lastName: string;

    @ApiProperty({ example: 'Doe@gmail.com', description: 'Email of the rider' })
    email: string;

    @ApiProperty({ example: 'abcd', description: 'licensePlate of the rider' })
    licensePlate: string;

    @ApiProperty({ example: '123456789', description: 'Phone number of the rider' })
    phoneNumber: string;
}
