import {inject} from '@loopback/core';
import {AnyObject, DefaultCrudRepository} from '@loopback/repository';
import {InMemoryDbDataSource} from '../datasources';
import {Aggregate, AggregateRelations} from '../models';

export class AggregateRepository extends DefaultCrudRepository<
  Aggregate,
  typeof Aggregate.prototype.id,
  AggregateRelations
> {
  constructor(
    @inject('datasources.InMemoryDb') dataSource: InMemoryDbDataSource,
  ) {
    super(Aggregate, dataSource);
  }

  /**
   * calculate the addition of a new value to the average
   * @param {number} value - value to be added to the average
   * @returns Promise<{count: number; avg: number;}> - will return count and avg.
   * @memberof AggregateRepository
   */
  async addAvg(value: number): Promise<{count: number; avg: number;}> {
    // get current metric
    const currentMetric = await this.get();

    // set current count as previous count
    const previousCount = (currentMetric?.count ?? 0);

    // calc total value from previous count and avg.
    const totalValue = (currentMetric?.avg ?? 0) * previousCount;

    // add 1 to the previous count
    const count = previousCount + 1;

    // calc new avg
    const avg = (value + totalValue) / count;

    // return new avg and new count
    return {count, avg};
  }

  /**
   * Represents the subtract of a value from current average
   * @param {number} value - value to be subtracted from current average
   * @returns
   */

  /**
   * calculate the subtract of a value from current average
   * @param {number} value  - value to be subtracted from current average
   * @returns Promise<{count: number; avg: number;}> - will return count and avg.
   * @memberof AggregateRepository
   */
  async subtractAvg(value: number): Promise<{count: number; avg: number;}> {
    const currentMetric = await this.get();
    const count = (currentMetric?.count ?? 0);
    const avg = ((currentMetric?.avg ?? 0) * count - value) / ((count - 1) < 1 ? 1 : (count - 1));
    return {count: (count - 1) < 0 ? 0 : (count - 1), avg: avg < 0 ? 0 : avg};
  }

  /**
   * get the current aggregate record, if not exist then return a new aggregate record
   * @returns {Promise<Aggregate>} - will return the aggregate record
   * @memberof AggregateRepository
   */
  async get(): Promise<Aggregate> {
    //NOTE Update createdBy Field
    return (await super.findOne()) ?? new Aggregate({createdBy: 'Sohaib'});
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
