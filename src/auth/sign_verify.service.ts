

import {HttpErrors} from '@loopback/rest';
import {ethers} from "ethers";
import {logger} from '../logger';
import {Metric} from '../models';
export interface ISignVerifyService {
  verifySign(metric: Metric): string;
}



/**
 * Service to verify Sign using ethers
 * @export
 * @class SignVerifyService
 * @implements {ISignVerifyService}
 */
export class SignVerifyService implements ISignVerifyService {

  /**
   * verify signature using Metric Model value
   * @param {Metric} metric - Metric Model
   * @returns {Promise<string>} - return signerAddress
   * @memberof SignVerifyService
   */
  verifySign(metric: Metric): string {
    if (!metric?.sign || !metric?.value || !metric?.timestamp || !metric?.address) {
      throw new HttpErrors.Unauthorized(
        `Error verifying signaute : 'sign' or 'value' or 'timestamp' or 'address' is null`,
      );
    }
    let signerAddress;
    try {
      // convert timestamp to unix timestamp
      const unix = Math.floor(new Date(metric?.timestamp).getTime() / 1000);

      // concat value and unix timestamp
      const concatedValue = (metric?.value)?.toString().concat((unix)?.toString());

      // verify signature
      const signerAddr = ethers.utils.verifyMessage(concatedValue, metric?.sign);

      // match signer address with metric address
      if (signerAddr !== metric?.address) {
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

