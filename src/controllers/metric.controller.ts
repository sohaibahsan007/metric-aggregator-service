/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Filter, repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, requestBody,
  response
} from '@loopback/rest';
import {AuthStrategy} from '../auth';
import {Metric} from '../models';
import {MetricRepository} from '../repositories';
import {MetricService} from '../services/metric.service';
export class MetricController {
  constructor(
    @service(MetricService)
    public metricService: MetricService,
    @repository(MetricRepository)
    public metricRepository: MetricRepository,
  ) {
  }

  @authenticate({strategy: AuthStrategy.Sign})
  @post('/metrics')
  @response(200, {
    description: 'Metric model instance',
    content: {'application/json': {schema: getModelSchemaRef(Metric)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Metric, {
            title: 'NewMetric',
            exclude: ['id', 'createdBy', 'createdOn', 'updatedOn', 'stale'],
          }),
        },
      },
    })
    metric: Omit<Metric, 'id'>,
  ): Promise<Metric> {
    return this.metricService.createMetricRecord(metric);
  }

  @get('/metrics')
  @response(200, {
    description: 'Array of Metric model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Metric, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Metric) filter?: Filter<Metric>,
  ): Promise<Metric[]> {
    return this.metricRepository.find(filter);
  }
}
