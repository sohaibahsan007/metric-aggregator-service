import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {InMemoryDbDataSource} from '../datasources';
import {State, StateRelations} from '../models';

export class StateRepository extends DefaultCrudRepository<
  State,
  typeof State.prototype.id,
  StateRelations
> {
  constructor(
    @inject('datasources.InMemoryDb') dataSource: InMemoryDbDataSource,
  ) {
    super(State, dataSource);
  }
}
