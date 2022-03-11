import {repository} from '@loopback/repository';
import {environment} from '../environments';
import {StateRepository} from './../repositories/state.repository';

export class StaleDataService {
  constructor(
    @repository(StateRepository) private stateRepository: StateRepository) {
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

  /**
   * auto check for Stale Data based on staleTime in environment
   * will remove the value from aggregate and update the state record
   * @required - staleTime in environment
   * @memberof StaleDataService
   */
  async checkForStaleData() {

    //NOTE Remove me please
    await this.autoCreate();

    // get staleTime from environment
    const staleTime = parseInt(environment.staleTime);
    // subtract staleTime from current timers time
    const currentTime = new Date().getTime();

    // caclulate the time to check for stale data
    const staleTimePeriod = new Date(currentTime - (staleTime * 1000));
    console.log('Stale Period: ' + staleTimePeriod.toISOString());

    // get list of all states which satisfy the staleTime and stale = false condition
    const stateListToStale = await this.stateRepository.find({where: {timestamp: {lt: staleTimePeriod}, stale: false}});
    console.log('Stale Data: ' + stateListToStale.length);

    // update the state record to make it stale and calculate the new aggregate
    for (const state of stateListToStale) {
      await this.stateRepository.update(state);
    }
  }

}
