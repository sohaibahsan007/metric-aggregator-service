import {model, property} from '@loopback/repository';
import {BaseModel} from './base.entity';

@model()
export class Aggregate extends BaseModel {

  @property({
    type: 'number',
    required: true,
  })
  avg: number;

  @property({
    type: 'number',
    required: true,
  })
  count: number;

  constructor(data?: Partial<Aggregate>) {
    super(data);
  }
}

