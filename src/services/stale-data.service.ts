import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {logger} from '../logger';
import {Metric} from '../models';
import {config} from './../config';
import {MetricRepository} from './../repositories/metric.repository';
import {MetricService} from './metric.service';

export class StaleDataService {
  constructor(
    @repository(MetricRepository) private metricRepository: MetricRepository,
    @service(MetricService) private metricService: MetricService) {
  }
  /**
   * auto check for Stale Data based on staleTime in environment
   * will remove the value from aggregate and update the metric record
   * @required - staleTime in environment
   * @memberof StaleDataService
   */
  async updateStaleData() {

    // get staleTime from environment
    const staleTime = this.getStaleTime(parseInt(config.staleTime));

    // get list of all metrics which satisfy the staleTime and stale = false condition
    const metricListToStale = await this.getStaledRecords(staleTime);

    logger.debug('Stale Data: ' + metricListToStale.length);

    // make data stale  by calling staleMetricRecord method
    await this.makeDataStale(metricListToStale);

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
   * get list of all metrics which satisfy the staleTime and stale = false condition
   * @param {Date} staleTime
   * @returns {Promise<Metric[]>} - list of all metrics which satisfy the staleTime and stale = false condition
   * @memberof StaleDataService
   */
  getStaledRecords(staleTime: Date): Promise<Metric[]> {
    return this.metricRepository.find({where: {timestamp: {lt: staleTime}, stale: false}});
  }

  /**
   * make data stale  by calling staleMetricRecord method
   * @param {Metric[]} metricListToStale - list of all metrics which satisfy the staleTime and stale = false condition
   * @memberof StaleDataService
   */
  async makeDataStale(metricListToStale: Metric[]) {
    // stale metric record  and calculate the new aggregate
    for (const metric of metricListToStale) {
      logger.debug('Now Stale Data Value: ' + metric.value);
      // call Metric Service to make the metric stale
      await this.metricService.staleMetricRecord(metric);
    }
  }

}
