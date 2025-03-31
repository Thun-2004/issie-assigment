import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';

export class UpdateRiderDto extends PartialType(CreateLocationDto) {}
