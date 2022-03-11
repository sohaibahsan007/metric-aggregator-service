import {repository} from '@loopback/repository';
import {environment} from '../environments';
import {AggregateRepository} from './../repositories/aggregate.repository';
import {StateRepository} from './../repositories/state.repository';

export class StaleDataService {
  constructor(
    @repository(StateRepository) private stateRepository: StateRepository,
    @repository(AggregateRepository) private aggregateRepository: AggregateRepository) {
  }
  async autoCreate() {
    //NOTE Remove me please
    const count = await this.stateRepository.count();
    if (count?.count <= 9) {
      const t = new Date();
      for (let i = 1; i <= 10; i++) {
        await this.stateRepository.create({value: 10 * i, timestamp: t, address: '0x0', sign: '0x0'});
        t.setSeconds(t.getSeconds() + 6);
      }
    }
  }
  async checkForStaleData() {
    await this.autoCreate();
    const staleTime = parseInt(environment.staleTime);
    // subtract staleTime from current timers time
    const currentTime = new Date().getTime();
    const staleTimePeriod = new Date(currentTime - (staleTime * 1000));
    console.log('Stale Period: ' + staleTimePeriod.toISOString());
    const stateListToStale = await this.stateRepository.find({where: {timestamp: {lt: staleTimePeriod}, stale: false}});
    console.log('Stale Data: ' + stateListToStale.length);
    for (const state of stateListToStale) {
      await this.stateRepository.update(state);
    }
  }

}
