import {expect} from '@loopback/testlab';
import {Aggregate} from '../../models';
import {AggregateService} from './../../services/aggregate.service';


describe('AggregateService', function (this: Mocha.Suite) {
  let aggregateService: AggregateService;

  before('setupApplication', () => {
    (aggregateService = new AggregateService());
  });

  it('add value in Average', () => {
    // set avg and count to 0 to start with
    const aggregate = new Aggregate({count: 0, avg: 0});

    // pass 10 as value with aggregate
    const response = aggregateService.addAvg(10, aggregate);

    // expect count to be 1 and avg to be 10
    expect(response.count).to.equal(1);
    expect(response.avg).to.equal(10);
  });

  it('subtract value in Average', () => {
    // set avg and count to 56 and 10 to start with
    // this is the average and count for
    // Values: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100
    // Count is 10 and Average is 55
    const aggregate = new Aggregate({count: 10, avg: 55});

    // pass 10 as value with aggregate to be subtracted
    const response = aggregateService.subtractAvg(10, aggregate);

    // expect count to be 9 and avg to be 60
    expect(response.count).to.equal(9);
    expect(response.avg).to.equal(60);
  });

});
