import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RiderService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRiderDto) {
    try {
      const result = await this.prisma.rider.create({ data });
      return {
        success: true,
        message: 'Rider created successfully',
        data: {
          id: result.id,
          firstname: result.firstname,
          lastName: result.lastName,
          email: result.email,
          licensePlate: result.licensePlate,
          phoneNumber: result.phoneNumber,
        },
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = (error.meta?.target as string[]) || [];
        const duplicatedFields = target.join(', ');
        throw new BadRequestException(
          `Pre-existed value for: ${duplicatedFields}`,
        );
      }
      throw new BadRequestException('Failed to create rider');
    }
  }

  async findAll() {
    try {
      return await this.prisma.rider.findMany();
    } catch (error) {
      throw new BadRequestException('Failed to fetch riders');
    }
  }

  async findOne(id: number) {
    if (!id || isNaN(id)) throw new BadRequestException('Invalid rider ID');

    const rider = await this.prisma.rider.findUnique({ where: { id } });
    if (!rider) throw new NotFoundException('Rider not found');
    return rider;
  }

  async update(id: number, data: UpdateRiderDto) {
    const rider = await this.prisma.rider.findUnique({ where: { id } });
    if (!rider) throw new NotFoundException('Rider not found');

    try {
      return await this.prisma.rider.update({ where: { id }, data });
    } catch (error) {
      throw new BadRequestException('Failed to update rider');
    }
  }

  async remove(id: number) {
    const rider = await this.prisma.rider.findUnique({ where: { id } });
    if (!rider) throw new NotFoundException('Rider not found');

    try {
      return await this.prisma.rider.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException('Failed to delete rider');
    }
  }

  async findLocations(riderId: number) {
    if (!riderId || isNaN(riderId))
      throw new BadRequestException('Invalid rider ID');

    const rider = await this.prisma.rider.findUnique({
      where: { id: riderId },
    });
    if (!rider) throw new NotFoundException('Rider not found');

    try {
      const locations = await this.prisma.location.findMany({
        where: { riderId },
      });
      return {
        latitude: locations[0]?.latitude,
        longitude: locations[0]?.longitude,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch locations');
    }
  }

  async createLocation(riderId: number, locations: CreateLocationDto) {
    const rider = await this.prisma.rider.findUnique({
      where: { id: riderId },
    });
    if (!rider) throw new NotFoundException('Rider not found');

    try {
      const result = await this.prisma.location.create({
        data: { riderId, ...locations },
      });
      if (result) {
        return {
          success: true,
          message: 'Location created successfully',
          data: {
            latitude: result.latitude,
            longitude: result.longitude,
          },
        };
      }
    } catch (error) {
      throw new BadRequestException('Failed to create location');
    }
  }

  async searchNearby(latitude: number, longitude: number) {
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new BadRequestException('Invalid latitude or longitude');
    }

    try {
      const radiusInKm = 5;
      const riders = await this.prisma.rider.findMany({
        include: {
          locations: true,
        },
      });

      return riders.filter((rider) => {
        const latestLocation = rider.locations[rider.locations.length - 1];
        if (!latestLocation) return false;

        const distance = this.getDistanceFromLatLonInKm(
          latitude,
          longitude,
          latestLocation.latitude,
          latestLocation.longitude,
        );
        return distance <= radiusInKm;
      });
    } catch (error) {
      throw new BadRequestException('Failed to search nearby riders');
    }
  }

  private getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
