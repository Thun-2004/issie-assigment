import { Test, TestingModule } from '@nestjs/testing';
import { RiderService } from './riders.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

  it('should throw BadRequestException when latitude/longitude is NaN', async () => {
    await expect(service.searchNearby(NaN, 100)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when rider is not found', async () => {
    jest.spyOn(prisma.rider, 'findUnique').mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });
});