import {inject} from '@loopback/core';
import {AnyObject, DataObject, DefaultCrudRepository, repository} from '@loopback/repository';
import {InMemoryDbDataSource} from '../datasources';
import {State} from '../models';
import {AggregateRepository} from './aggregate.repository';
export class StateRepository extends DefaultCrudRepository<
  State,
  typeof State.prototype.id
> {
  constructor(
    @inject('datasources.InMemoryDb') dataSource: InMemoryDbDataSource,
    @repository(AggregateRepository) private aggregateRepository: AggregateRepository,
  ) {
    super(State, dataSource);

  }
  /**
   * create and calculate the aggregate
   * @param {DataObject<State>} entity - pass in the entity
   * @param {AnyObject} [options] - pass in the options
   * @returns {Promise<State>} - return the created entity
   * @memberof StateRepository
   */
  async create(entity: DataObject<State>, options?: AnyObject): Promise<State> {
    // calculate  current average and count using entity value
    const {count, avg} = await this.aggregateRepository.addAvg(entity?.value ?? 0);

    // update aggregate record with new avg and count
    await this.aggregateRepository.update({avg, count});

    // create and return the created entity
    return super.create(entity, options);
  }

  /**
   * update stale data and subtract value from the aggregate
   * @param {DataObject<State>} entity - pass in the entity
   * @param {AnyObject} [options] -   pass in the options
   * @returns {Promise<void>} -   return void
   * @memberof StateRepository
   */
  async update(entity: DataObject<State>, options?: AnyObject): Promise<void> {

    // calculate new count and average after subtracting the value
    const {count, avg} = await this.aggregateRepository.subtractAvg(entity?.value ?? 0);

    // update aggregate record with new avg and count
    await this.aggregateRepository.update({avg, count});

    // make the state stale after subtracting the value
    entity.stale = true;

    // update the entity
    return super.updateById(entity.id, entity, options);
  }

}
