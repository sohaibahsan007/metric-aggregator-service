import {BindingScope, injectable, service} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {Metric} from '../models';
import {AggregateRepository, MetricRepository} from '../repositories';
import {AggregateService} from './aggregate.service';

@injectable({scope: BindingScope.TRANSIENT})
export class MetricService {
  constructor(
    @repository(AggregateRepository) private aggregateRepository: AggregateRepository,
    @service(AggregateService) private aggregateService: AggregateService,
    @repository(MetricRepository) private metricRepository: MetricRepository,
  ) { }

  /**
 * create and calculate the aggregate
 * @param {DataObject<Metric>} entity - pass in the entity
 * @returns {Promise<Metric>} - return the created entity
 * @memberof StaleService
 */
  async createMetricRecord(entity: DataObject<Metric>): Promise<Metric> {
    // get aggregate
    const aggregate = await this.aggregateRepository.get();
    // calculate  current average and count using entity value
    const {count, avg} = this.aggregateService.addAvg(entity?.value ?? 0, aggregate);

    // update aggregate record with new avg and count
    await this.aggregateRepository.update({avg, count});

    // create and return the created entity
    return this.metricRepository.create(entity);
  }

  /**
   * stale Metric Record and subtract value from the aggregate
   * @param {DataObject<Metric>} entity - pass in the entity
   * @returns {Promise<void>} -   return void
   * @memberof StaleService
   */
  async staleMetricRecord(entity: DataObject<Metric>): Promise<void> {
    // get aggregate
    const aggregate = await this.aggregateRepository.get();

    // calculate new count and average after subtracting the value
    const {count, avg} = this.aggregateService.subtractAvg(entity?.value ?? 0, aggregate);

    // update aggregate record with new avg and count
    await this.aggregateRepository.update({avg, count});

    // make the metric stale after subtracting the value
    entity.stale = true;
    // update the entity
    return this.metricRepository.updateById(entity.id, entity);
  }
}
