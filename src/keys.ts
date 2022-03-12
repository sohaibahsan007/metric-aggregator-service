import {BindingKey} from '@loopback/core';
import {SignVerifyService} from './auth/sign_verify.service';

export namespace SignServiceBindings {
  export const SIGN_VERIFY = BindingKey.create<SignVerifyService>(
    'authorization.signVerifyService',
  );
}
