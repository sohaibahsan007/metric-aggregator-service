import {inject} from '@loopback/core';
import {AnyObject, DefaultCrudRepository} from '@loopback/repository';
import {InMemoryDbDataSource} from '../datasources';
import {Aggregate} from '../models';

export class AggregateRepository extends DefaultCrudRepository<
  Aggregate,
  typeof Aggregate.prototype.id
> {
  constructor(
    @inject('datasources.InMemoryDb') dataSource: InMemoryDbDataSource,
  ) {
    super(Aggregate, dataSource);
  }



  /**
   * get the current aggregate record, if not exist then return a new aggregate record
   * @returns {Promise<Aggregate>} - will return the aggregate record
   * @memberof AggregateRepository
   */
  async get(): Promise<Aggregate> {
    return (await super.findOne()) ?? new Aggregate({});
  }

  /**
   * Updates/Creates the aggregate with the new values
   * will auto attach the createdOn field
   * will auto attach the createdBy field
   * @param {Partial<Aggregate>} entity - the aggregate entity
   * @param {AnyObject} [options] - the options
   * @returns {Promise<void>} -   return void
   * @memberof AggregateRepository
   */
  async update(entity: Partial<Aggregate>, options?: AnyObject): Promise<void> {
    const currentMetric = await this.get();
    currentMetric.avg = entity?.avg ?? 0;
    currentMetric.count = entity?.count ?? 0;
    currentMetric.updatedOn = new Date();
    await super.save(currentMetric, options);
    return;
  }


}
