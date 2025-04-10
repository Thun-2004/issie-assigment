import { Test, TestingModule } from '@nestjs/testing';
import { RiderService } from './riders.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('RiderService', () => {
  let service: RiderService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiderService, PrismaService],
    }).compile();

    service = module.get<RiderService>(RiderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a rider successfully', async () => {
      const data = {
        firstname: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        licensePlate: 'ABC123',
        phoneNumber: '0812345678',
      };

      const mockedResult = {
        id: 1,
        ...data,
      };

      jest.spyOn(prisma.rider, 'create').mockResolvedValue(mockedResult as any);

      const result = await service.create(data as any);

      expect(result).toEqual({
        success: true,
        message: 'Rider created successfully',
        data: mockedResult,
      });
    });

    it('should throw BadRequestException on duplicate error', async () => {
      jest.spyOn(prisma.rider, 'create').mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });
      await expect(
        service.create({
          firstname: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          licensePlate: 'ABC123',
          phoneNumber: '0812345678',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOne(NaN)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when rider is not found', async () => {
      jest.spyOn(prisma.rider, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('should return rider when found', async () => {
      const rider = { id: 1, firstname: 'John' };
      jest.spyOn(prisma.rider, 'findUnique').mockResolvedValue(rider as any);
      const result = await service.findOne(1);
      expect(result).toEqual(rider);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException when rider not found', async () => {
      jest.spyOn(prisma.rider, 'findUnique').mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should delete rider when found', async () => {
      const rider = { id: 1 };
      jest.spyOn(prisma.rider, 'findUnique').mockResolvedValue(rider as any);
      jest.spyOn(prisma.rider, 'delete').mockResolvedValue(rider as any);

      const result = await service.remove(1);
      expect(result).toEqual(rider);
    });
  });

  describe('searchNearby', () => {
    it('should throw BadRequestException when latitude/longitude is NaN', async () => {
      await expect(service.searchNearby(NaN, 100)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return rider within radius', async () => {
      const rider = {
        id: 1,
        locations: [
          { latitude: 13.7, longitude: 100.5 },
          { latitude: 13.72, longitude: 100.52 },
        ],
      };
      jest.spyOn(prisma.rider, 'findMany').mockResolvedValue([rider] as any);

      const result = await service.searchNearby(13.7, 100.5);
      expect(result).toEqual([rider]);
    });
  });
});
