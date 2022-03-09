
import {Entity, property} from '@loopback/repository';

export abstract class BaseModel extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdOn?: Date;

  @property({
    type: 'string',
  })
  createdBy?: string;

}
