import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ValidationPipe} from '@nestjs/common';
import { RiderService } from './riders.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Riders')
@Controller('riders')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  @ApiOperation({ summary: 'Create new rider' })
  create(@Body(ValidationPipe) createRiderDto: CreateRiderDto) {
    return this.riderService.create(createRiderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all riders' })
  findAll() {
    return this.riderService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search riders within 5km radius' })
  @ApiQuery({ name: 'latitude', type: Number })
  @ApiQuery({ name: 'longitude', type: Number })
  searchNearby(@Query('latitude') latitude: string, @Query('longitude') longitude: string) {
    return this.riderService.searchNearby(+latitude, +longitude);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rider by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    return this.riderService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rider by ID' })
  @ApiParam({ name: 'id', type: Number })
  update(@Param('id') id: string, @Body(ValidationPipe) updateRiderDto: UpdateRiderDto) {
    return this.riderService.update(+id, updateRiderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rider by ID' })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string) {
    return this.riderService.remove(+id);
  }

  @Get(':riderId/locations')
  @ApiOperation({ summary: 'Get locations of a rider' })
  @ApiParam({ name: 'riderId', type: Number })
  findLocations(@Param('riderId') riderId: string) {
    return this.riderService.findLocations(+riderId);
  }

  @Post(':riderId/locations')
  @ApiOperation({ summary: 'Create location for a rider' })
  @ApiParam({ name: 'riderId', type: Number })
  createLocation(
    @Param('riderId') riderId: string,
    @Body(ValidationPipe) body: CreateLocationDto,
  ) {
    return this.riderService.createLocation(+riderId, body);
  }
}
