import {model, property} from '@loopback/repository';
import {BaseModel} from './base.entity';

@model()
export class State extends BaseModel {

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

  constructor(data?: Partial<State>) {
    super(data);
  }
}

export interface StateRelations {
  // describe navigational properties here
}

export type StateWithRelations = State & StateRelations;
