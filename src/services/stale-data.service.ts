import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {environment} from '../environments';
import {logger} from '../logger';
import {State} from '../models';
import {StateRepository} from './../repositories/state.repository';
import {StateService} from './state.service';

export class StaleDataService {
  constructor(
    @repository(StateRepository) private stateRepository: StateRepository,
    @service(StateService) private stateService: StateService) {
  }
  async autoCreate() {
    //NOTE Remove me please
    const count = await this.stateRepository.count();
    if (count?.count <= 9) {
      const t = new Date();
      for (let i = 1; i <= 10; i++) {
        await this.stateService.createStateRecord({value: 10 * i, timestamp: t, address: '0x0', sign: '0x0'});
        t.setSeconds(t.getSeconds() + 10);
      }
    }
  }

  /**
   * auto check for Stale Data based on staleTime in environment
   * will remove the value from aggregate and update the state record
   * @required - staleTime in environment
   * @memberof StaleDataService
   */
  async updateStaleData() {

    //NOTE Remove me please
    await this.autoCreate();

    // get staleTime from environment
    const staleTime = this.getStaleTime(parseInt(environment.staleTime));

    // get list of all states which satisfy the staleTime and stale = false condition
    const stateListToStale = await this.getStaledRecords(staleTime);

    logger.debug('Stale Data: ' + stateListToStale.length);

    // make data stale  by calling staleStateRecord method
    await this.makeDataStale(stateListToStale);

  }

  /**
   * get Stale Time in form of Date
   * required - staleTime in environment
   * @params {number} staleTime - staleTime in seconds
   * @returns {Date} - StaleTime Date Object
   * @memberof StaleDataService
   */
  getStaleTime(staleTime: number): Date {
    // subtract staleTime from current timers time
    const currentTime = new Date().getTime();

    // caclulate the time to check for stale data
    const staleTimePeriod = new Date(currentTime - (staleTime * 1000));
    logger.debug('Stale Period: ' + staleTimePeriod.toISOString());
    return staleTimePeriod;
  }

  /**
   * get list of all states which satisfy the staleTime and stale = false condition
   * @param {Date} staleTime
   * @returns {Promise<State[]>} - list of all states which satisfy the staleTime and stale = false condition
   * @memberof StaleDataService
   */
  getStaledRecords(staleTime: Date): Promise<State[]> {
    return this.stateRepository.find({where: {timestamp: {lt: staleTime}, stale: false}});
  }

  /**
   * make data stale  by calling staleStateRecord method
   * @param {State[]} stateListToStale - list of all states which satisfy the staleTime and stale = false condition
   * @memberof StaleDataService
   */
  async makeDataStale(stateListToStale: State[]) {
    // stale state record  and calculate the new aggregate
    for (const state of stateListToStale) {
      logger.debug('Now Stale Data Value: ' + state.value);
      // call State Service to make the state stale
      await this.stateService.staleStateRecord(state);
    }
  }

}
