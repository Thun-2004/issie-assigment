import { ApiProperty } from '@nestjs/swagger';
// import { IsNumber } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 13.7563, description: 'Latitude of the rider location' })
  latitude: number;

  @ApiProperty({ example: 100.5018, description: 'Longitude of the rider location' })
  longitude: number;
}
