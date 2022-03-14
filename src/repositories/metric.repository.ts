import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {InMemoryDbDataSource} from '../datasources';
import {Metric} from '../models';
export class MetricRepository extends DefaultCrudRepository<
  Metric,
  typeof Metric.prototype.id
> {
  constructor(
    @inject('datasources.InMemoryDb') dataSource: InMemoryDbDataSource,
  ) {
    super(Metric, dataSource);

  }
}
