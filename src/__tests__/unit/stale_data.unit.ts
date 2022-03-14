import {expect} from '@loopback/testlab';
import {AggregateService, MetricService} from '../../services';
import {AggregateRepository} from './../../repositories/aggregate.repository';
import {MetricRepository} from './../../repositories/metric.repository';
import {StaleDataService} from './../../services/stale-data.service';
import {testdb} from './../test-helper';


describe('StaleDataService', function (this: Mocha.Suite) {
  let metricRepository: MetricRepository;
  let staleDataService: StaleDataService;
  let metricService: MetricService;
  let aggregateService: AggregateService;
  let aggregateRepository: AggregateRepository;

  before('setupApplication', () => {
    aggregateService = new AggregateService();
    metricRepository = new MetricRepository(testdb);
    aggregateRepository = new AggregateRepository(testdb);
    metricService = new MetricService(aggregateRepository, aggregateService, metricRepository);
    staleDataService = new StaleDataService(metricRepository, metricService);
  });

  it('check stale data timing out of the aggregation', async () => {

    // CASE 1:
    // in this case we will add 10 sample values to the metric, in these value, one of them will meet stale data criteria

    const t = new Date();
    // get staleTime with timeout of 10 second
    const staleTime = staleDataService.getStaleTime(10);

    // make one record timestamp less than current staleTime Object
    t.setSeconds(t.getSeconds() - 11);
    // create dummy metric record with difference of 1 second from current time to make it stale
    for (let i = 1; i <= 10; i++) {
      await metricService.createMetricRecord({value: 10 * i, timestamp: t, address: '0x0', sign: '0x0'});
      // increase timestamp by 11 second each, so it will not be included in the stale data
      t.setSeconds(t.getSeconds() + 11);
    }

    // here we will verify the added sample values aggregate.
    // get current Aggregate
    let currentAggregate = await aggregateRepository.get();

    // check if the current aggregate count is 10
    expect(currentAggregate.count).to.equal(10);

    // check if current aggregate avg is 55
    expect(currentAggregate.avg).to.equal(55);


    // CASE 2:
    // in this case we will select one value which is stale data, and then we will mark it as stale and verify/check aggregate.

    // get all the staled metric list.
    const metricRecordList = await metricRepository.find({where: {timestamp: {lt: staleTime}, stale: false}});

    // check if all dummy records are has been added
    expect(metricRecordList?.length).to.equal(1);

    // execute method to make record stale
    await staleDataService.makeDataStale(metricRecordList);


    // get current Aggregate
    currentAggregate = await aggregateRepository.get();

    // check if the current aggregate count is 9 after 1 record will become stale
    expect(currentAggregate.count).to.equal(9);

    // check if current aggregate avg is 60 after 1st record with value 10 will become stale
    expect(currentAggregate.avg).to.equal(60);

    // the end of test

  });
});


