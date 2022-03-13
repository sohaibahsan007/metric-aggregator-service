import {expect} from '@loopback/testlab';
import {SignVerifyService} from '../../auth';
import {State} from '../../models';


describe('SignVerifyService', function (this: Mocha.Suite) {
  let signVerifyService: SignVerifyService;
  // set state to be used in verifySign
  const state = new State({
    timestamp: new Date('2022-03-13T13:52:54.654Z'),
    address: '0x31e7f9b72383C5FF7D91b62c361299b473480744',
    value: 865182,
    sign: '0x4a4e5e56f7422746772ac63fd4976bd88458011ce1bb014cd0ac0ee7819afe33372875aa5e7ebb419d02a0698c374f6be4a7497db617e93c853bbe52441bf7c41c'
  });

  before('setupApplication', () => {
    (signVerifyService = new SignVerifyService());
  });

  it('verify with valid sign', () => {
    // call the verifySign method with State as Param
    const response = signVerifyService.verifySign(state);
    // expect signerAddress to be exact with state address
    expect(response).to.equal(state?.address);
  });

  it('verify with invalid sign', () => {
    // will only change value to make it invalid
    state.value = 100;
    const call = function () {
      signVerifyService.verifySign(state)
    };
    expect(call).to.throw(Error);

  });

});
