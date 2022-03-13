import {expect} from '@loopback/testlab';
import {AggregateService, StateService} from '../../services';
import {AggregateRepository} from './../../repositories/aggregate.repository';
import {StateRepository} from './../../repositories/state.repository';
import {StaleDataService} from './../../services/stale-data.service';
import {testdb} from './../test-helper';


describe('StaleDataService', function (this: Mocha.Suite) {
  let stateRepository: StateRepository;
  let staleDataService: StaleDataService;
  let stateService: StateService;
  let aggregateService: AggregateService;
  let aggregateRepository: AggregateRepository;

  before('setupApplication', () => {
    aggregateService = new AggregateService();
    stateRepository = new StateRepository(testdb);
    aggregateRepository = new AggregateRepository(testdb);
    stateService = new StateService(aggregateRepository, aggregateService, stateRepository);
    staleDataService = new StaleDataService(stateRepository, stateService);
  });

  it('check stale data timing out of the aggregation', async () => {
    const t = new Date();
    // get staleTime with timeout of 1 second
    const staleTime = staleDataService.getStaleTime(10);

    // make one record timestamp less than current staleTime Object
    t.setSeconds(t.getSeconds() - 11);
    // create dummy state record with difference of 1 second from current time to make it stale
    for (let i = 1; i <= 10; i++) {
      await stateService.createStateRecord({value: 10 * i, timestamp: t, address: '0x0', sign: '0x0'});
      // increase timestamp by 11 second each, so it will not be included in the stale data
      t.setSeconds(t.getSeconds() + 11);
    }
    // get current Aggregate
    let currentAggregate = await aggregateRepository.get();

    // check if the current aggregate count is 10
    expect(currentAggregate.count).to.equal(10);

    // check if current aggregate avg is 55
    expect(currentAggregate.avg).to.equal(55);

    // get all the states
    const stateRecordList = await stateRepository.find({where: {timestamp: {lt: staleTime}, stale: false}});

    // check if all dummy records are has been added
    expect(stateRecordList?.length).to.equal(1);

    // execute method to make record stale
    await staleDataService.makeDataStale(stateRecordList);

    // again get current aggregate

    // get current Aggregate
    currentAggregate = await aggregateRepository.get();

    // check if the current aggregate count is 9 after 1 record will become stale
    expect(currentAggregate.count).to.equal(9);

    // check if current aggregate avg is 60 after 1st record with value 10 will become stale
    expect(currentAggregate.avg).to.equal(60);

    // the end of test

  });
});


