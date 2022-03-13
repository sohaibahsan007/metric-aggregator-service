

import {HttpErrors} from '@loopback/rest';
import {ethers} from "ethers";
import {logger} from '../logger';
import {State} from '../models';
export interface ISignVerifyService {
  verifySign(state: State): string;
}



/**
 * Service to verify Sign using ethers
 * @export
 * @class SignVerifyService
 * @implements {ISignVerifyService}
 */
export class SignVerifyService implements ISignVerifyService {

  /**
   * verify signature using State Model value
   * @param {State} state - State Model
   * @returns {Promise<string>} - return signerAddress
   * @memberof SignVerifyService
   */
  verifySign(state: State): string {
    if (!state?.sign || !state?.value || !state?.timestamp || !state?.address) {
      throw new HttpErrors.Unauthorized(
        `Error verifying signaute : 'sign' or 'value' or 'timestamp' or 'address' is null`,
      );
    }
    let signerAddress;
    try {
      // convert timestamp to unix timestamp
      const unix = Math.floor(new Date(state?.timestamp).getTime() / 1000);

      // concat value and unix timestamp
      const concatedValue = (state?.value)?.toString().concat((unix)?.toString());

      // verify signature
      const signerAddr = ethers.utils.verifyMessage(concatedValue, state?.sign);

      // match signer address with state address
      if (signerAddr !== state?.address) {
        logger.error('Invalid Signature');
        throw new HttpErrors.Unauthorized('Invalid Signature');
      }
      // set isValidSign to true
      signerAddress = signerAddr;

    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying signature : ${error.message}`,
      );
    }
    return signerAddress;
  }
}

