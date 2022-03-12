import {
  AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, JsonBodyParser, Request} from '@loopback/rest';
import {SignServiceBindings} from '../keys';
import {State} from '../models';
import {UserProfile} from './../../node_modules/@loopback/security/dist/types.d';
import {SignVerifyService} from './sign_verify.service';
export class SignStrategy implements AuthenticationStrategy {
  name = 'sign';

  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject(SignServiceBindings.SIGN_VERIFY) private signVerifyService: SignVerifyService
  ) { }
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const signBodyValue: State = await this.extractCredentials(request);
    try {
      const isValidSign = await this.signVerifyService.verifySign(signBodyValue);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {isValidSign} as any as UserProfile;
    } catch (err) {
      Object.assign(err, {code: 'INVALID_SIGN', statusCode: 401, });
      throw err;
    }
  }

  async extractCredentials(request: Request): Promise<State> {
    const body = await new JsonBodyParser().parse(request);
    if (!body?.value) {
      throw new HttpErrors.Unauthorized(`Authorization body not found`);
    }
    const signBodyValue = body?.value as State;

    if (!signBodyValue.sign || !signBodyValue.value || !signBodyValue.timestamp || !signBodyValue.address) {
      throw new HttpErrors.Unauthorized(
        `Required values like 'sign' or 'value' or 'timestamp' or 'address' not found'.`,
      );
    }
    return signBodyValue;
  }
}

