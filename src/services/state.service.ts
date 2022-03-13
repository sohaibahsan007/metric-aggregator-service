import {BindingScope, injectable, service} from '@loopback/core';
import {DataObject, repository} from '@loopback/repository';
import {State} from '../models';
import {AggregateRepository, StateRepository} from '../repositories';
import {AggregateService} from './aggregate.service';

@injectable({scope: BindingScope.TRANSIENT})
export class StateService {
  constructor(
    @repository(AggregateRepository) private aggregateRepository: AggregateRepository,
    @service(AggregateService) private aggregateService: AggregateService,
    @repository(StateRepository) private stateRepository: StateRepository,
  ) { }

  /**
 * create and calculate the aggregate
 * @param {DataObject<State>} entity - pass in the entity
 * @returns {Promise<State>} - return the created entity
 * @memberof StaleService
 */
  async createStateRecord(entity: DataObject<State>): Promise<State> {
    // get aggregate
    const aggregate = await this.aggregateRepository.get();
    // calculate  current average and count using entity value
    const {count, avg} = this.aggregateService.addAvg(entity?.value ?? 0, aggregate);

    // update aggregate record with new avg and count
    await this.aggregateRepository.update({avg, count});

    // create and return the created entity
    return this.stateRepository.create(entity);
  }

  /**
   * stale State Record and subtract value from the aggregate
   * @param {DataObject<State>} entity - pass in the entity
   * @returns {Promise<void>} -   return void
   * @memberof StaleService
   */
  async staleStateRecord(entity: DataObject<State>): Promise<void> {
    // get aggregate
    const aggregate = await this.aggregateRepository.get();

    // calculate new count and average after subtracting the value
    const {count, avg} = this.aggregateService.subtractAvg(entity?.value ?? 0, aggregate);

    // update aggregate record with new avg and count
    await this.aggregateRepository.update({avg, count});

    // make the state stale after subtracting the value
    entity.stale = true;
    // update the entity
    return this.stateRepository.updateById(entity.id, entity);
  }
}
