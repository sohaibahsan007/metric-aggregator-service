import {expect} from '@loopback/testlab';
import {SignVerifyService} from '../../auth';
import {Metric} from '../../models';


describe('SignVerifyService', function (this: Mocha.Suite) {
  let signVerifyService: SignVerifyService;
  // set metric to be used in verifySign
  const metric = new Metric({
    timestamp: new Date('2022-03-13T13:52:54.654Z'),
    address: '0x31e7f9b72383C5FF7D91b62c361299b473480744',
    value: 865182,
    sign: '0x4a4e5e56f7422746772ac63fd4976bd88458011ce1bb014cd0ac0ee7819afe33372875aa5e7ebb419d02a0698c374f6be4a7497db617e93c853bbe52441bf7c41c'
  });

  before('get instance of SignVerifyService', () => {
    (signVerifyService = new SignVerifyService());
  });

  it('verify with valid sign', () => {
    // call the verifySign method with Metric as Param
    const response = signVerifyService.verifySign(metric);
    // expect signerAddress to be exact with metric address
    expect(response).to.equal(metric?.address);
  });

  it('verify with invalid sign', () => {
    // will only change value to make it invalid
    metric.value = 100;
    const call = function () {
      signVerifyService.verifySign(metric)
    };
    expect(call).to.throw(Error);

  });

});
