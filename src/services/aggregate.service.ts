import {BindingScope, injectable} from '@loopback/core';
import {Aggregate} from '../models';


@injectable({scope: BindingScope.TRANSIENT})
export class AggregateService {
  constructor() {
  }

  /**
 * calculate the addition of a new value to the average
 * @param {number} value - value to be added to the average
 * @param {Aggregate} aggregate - the current aggregate record
 * @returns {count: number; avg: number;} - will return count and avg.
 * @memberof AggregateRepository
 */
  addAvg(value: number, aggregate: Aggregate): {count: number; avg: number;} {
    // set current count as previous count
    const previousCount = (aggregate?.count ?? 0);

    // calc total value from previous count and avg.
    const totalValue = (aggregate?.avg ?? 0) * previousCount;

    // add 1 to the previous count
    const count = previousCount + 1;

    // calc new avg
    const avg = (value + totalValue) / count;

    // return new avg and new count
    return {count, avg};
  }

  /**
   * calculate the subtract of a value from current average
   * @param {number} value  - value to be subtracted from current average
   * @param {Aggregate} aggregate - the current aggregate record
   * @returns {count: number; avg: number;} - will return count and avg.
   * @memberof AggregateRepository
   */
  subtractAvg(value: number, aggregate: Aggregate): {count: number; avg: number;} {
    const count = (aggregate?.count ?? 0);
    const avg = ((aggregate?.avg ?? 0) * count - value) / ((count - 1) < 1 ? 1 : (count - 1));
    return {count: (count - 1) < 0 ? 0 : (count - 1), avg: avg < 0 ? 0 : avg};
  }

}
