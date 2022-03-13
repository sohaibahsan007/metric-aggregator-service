import {
  AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, JsonBodyParser, Request} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {SignServiceBindings} from '../keys';
import {State} from '../models';
import {UserProfile} from './../../node_modules/@loopback/security/dist/types.d';
import {SignVerifyService} from './sign_verify.service';

/**
 * Sign Strategy which will be used to initiate the auth using sign strategy
 * @export
 * @class SignStrategy
 * @implements {AuthenticationStrategy}
 */
export class SignStrategy implements AuthenticationStrategy {
  name = 'sign';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject(SignServiceBindings.SIGN_VERIFY) private signVerifyService: SignVerifyService
  ) { }


  /**
   * Authenticate using Request body
   * it will extract credentials from request body and verify sign using SignVerifyService
   * @param {Request} request - request object
   * @returns {(Promise<UserProfile | undefined>)} - return UserProfile if required
   * @memberof SignStrategy
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {

    // extract credentials from request body
    const signBodyValue: State = await this.extractCredentials(request);
    try {
      // verify sign using SignVerifyService verifySign method
      const signerAddress = this.signVerifyService.verifySign(signBodyValue);
      const userProfile = Object.assign(
        {[securityId]: ''},
        {
          [securityId]: signerAddress,
        }
      );
      return userProfile;
    } catch (err) {

      // throw error if verifySign method throws error
      Object.assign(err, {code: 'INVALID_SIGN', statusCode: 401, });
      throw err;
    }
  }

  /**
   * Extract credentials from request body
   * @param {Request} request - request object
   * @returns {Promise<State>} - return State Model
   * @memberof SignStrategy
   */
  async extractCredentials(request: Request): Promise<State> {

    // using JsonBodyParser to parse request body
    const body = await new JsonBodyParser().parse(request);

    // validate request body
    if (!body?.value) {
      throw new HttpErrors.Unauthorized(`Authorization body not found`);
    }

    // convert body.value into State Model
    const signBodyValue = body?.value as State;

    // validate State Model properties which are required in verification of sign
    if (!signBodyValue.sign || !signBodyValue.value || !signBodyValue.timestamp || !signBodyValue.address) {
      throw new HttpErrors.Unauthorized(
        `Required values like 'sign' or 'value' or 'timestamp' or 'address' not found'.`,
      );
    }

    // return State Model
    return signBodyValue;
  }
}

