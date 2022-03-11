/* eslint-disable @typescript-eslint/naming-convention */
import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from '@loopback/rest';
import {Aggregate} from '../models';
import {AggregateRepository} from '../repositories';

export class AggregateController {
  constructor(
    @repository(AggregateRepository)
    public aggregateRepository : AggregateRepository,
  ) {}

  @get('/aggregates')
  @response(200, {
    description: 'Array of Aggregate model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Aggregate, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Aggregate) filter?: Filter<Aggregate>,
  ): Promise<Aggregate[]> {
    return this.aggregateRepository.find(filter);
  }

}
