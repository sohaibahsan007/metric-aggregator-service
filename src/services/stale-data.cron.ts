import {service} from '@loopback/core';
import {cronJob, CronJob} from '@loopback/cron';
import {logger} from '../logger';
import {StaleDataService} from './stale-data.service';

@cronJob()
export class StaleDataCronJob extends CronJob {
  constructor(
    @service(StaleDataService) private staleDataService: StaleDataService,
  ) {
    super({
      name: 'stale-data-cron-job',
      onTick: () => {
        logger.info('Cron job started...');
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        // this.staleDataService.checkForStaleData();
      },
      cronTime: `*/60 * * * * *`,
      // Starts the cron job as soon as application starts
      start: true,
      // Immediately fires onTick function
      runOnInit: false
    });

  }
}

