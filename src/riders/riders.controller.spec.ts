import { Test, TestingModule } from '@nestjs/testing';
import { RiderController } from './riders.controller';
import { RiderService } from './riders.service';

describe('RiderController', () => {
  let controller: RiderController;
  let service: RiderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiderController],
      providers: [
        {
          provide: RiderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findLocations: jest.fn(),
            createLocation: jest.fn(),
            searchNearby: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RiderController>(RiderController);
    service = module.get<RiderService>(RiderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create()', async () => {
    await controller.create({} as any);
    expect(service.create).toHaveBeenCalled();
  });

  it('should call findAll()', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call findOne()', async () => {
    await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should call update()', async () => {
    await controller.update('1', {} as any);
    expect(service.update).toHaveBeenCalledWith(1, {});
  });

  it('should call remove()', async () => {
    await controller.remove('1');
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should call findLocations()', async () => {
    await controller.findLocations('1');
    expect(service.findLocations).toHaveBeenCalledWith(1);
  });

  it('should call createLocation()', async () => {
    await controller.createLocation('1', { latitude: 13.7, longitude: 100.5 });
    expect(service.createLocation).toHaveBeenCalledWith(1, { latitude: 13.7, longitude: 100.5 });
  });

  it('should call searchNearby()', async () => {
    await controller.searchNearby('13.7', '100.5');
    expect(service.searchNearby).toHaveBeenCalledWith(13.7, 100.5);
  });
});
