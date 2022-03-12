/* eslint-disable @typescript-eslint/naming-convention */
import {
  Filter,
  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, response
} from '@loopback/rest';
import {Aggregate} from '../models';
import {AggregateRepository} from '../repositories';

export class AggregateController {
  constructor(
    @repository(AggregateRepository)
    public aggregateRepository: AggregateRepository,
  ) { }

  @get('/aggregate')
  @response(200, {
    description: 'Aggregate model instance. For now it will only have the count and avg.',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Aggregate, {includeRelations: true}),
      },
    },
  })
  async findOne(
    @param.filter(Aggregate) filter?: Filter<Aggregate>,
  ): Promise<Aggregate | null> {
    return this.aggregateRepository.findOne(filter);
  }

}
