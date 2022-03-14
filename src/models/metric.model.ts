import {model, property} from '@loopback/repository';
import {BaseModel} from './base.entity';

@model()
export class Metric extends BaseModel {

  @property({
    type: 'date',
    required: true,
  })
  timestamp: Date;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      nullable: false,
    },
  })
  value: number;

  @property({
    type: 'string',
    required: true,
  })
  sign: string;

  @property({
    type: 'boolean',
    default: false,
  })
  stale?: boolean;

  constructor(data?: Partial<Metric>) {
    super(data);
  }
}
