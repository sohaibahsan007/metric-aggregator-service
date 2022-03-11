import {inject} from '@loopback/core';
import {AnyObject, DataObject, DefaultCrudRepository, repository} from '@loopback/repository';
import {InMemoryDbDataSource} from '../datasources';
import {State, StateRelations} from '../models';
import {AggregateRepository} from './aggregate.repository';

export class StateRepository extends DefaultCrudRepository<
  State,
  typeof State.prototype.id,
  StateRelations
> {
  constructor(
    @inject('datasources.InMemoryDb') dataSource: InMemoryDbDataSource,
    @repository(AggregateRepository) private aggregateRepository: AggregateRepository,
  ) {
    super(State, dataSource);

  }
  async create(entity: DataObject<State>, options?: AnyObject): Promise<State> {
    const {count, avg} = await this.aggregateRepository.addAvg(entity?.value ?? 0);
    await this.aggregateRepository.update({avg, count});
    return super.create(entity, options);
  }
  async update(entity: DataObject<State>, options?: AnyObject): Promise<void> {
    const {count, avg} = await this.aggregateRepository.subtractAvg(entity?.value ?? 0);
    await this.aggregateRepository.update({avg, count});
    entity.stale = true;
    return super.updateById(entity.id, entity, options);
  }

}
