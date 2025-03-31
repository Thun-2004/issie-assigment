import { Module } from '@nestjs/common';
import { RiderService } from './riders.service';
import { RiderController } from './riders.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [RiderController],
  providers: [RiderService, PrismaService],

})
export class RidersModule {}
