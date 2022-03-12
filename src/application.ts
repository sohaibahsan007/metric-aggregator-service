import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {SignStrategy} from './auth';
import {SignVerifyService} from './auth/sign_verify.service';
import {SignServiceBindings} from './keys';
import {LogMiddleware} from './logger';
import {StaleDataCronJob} from './services/stale-data.cron';

export {ApplicationConfig};

export class MetricAggregatorServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);


    this.middleware(LogMiddleware);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    // add cronJob Component
    this.component(CronComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };


    // add authentication component
    this.component(AuthenticationComponent);

    // Bind SignStrategy authentication strategy related elements
    registerAuthenticationStrategy(this, SignStrategy);


    this.bind(SignServiceBindings.SIGN_VERIFY).toClass(SignVerifyService);

    // add cronJob
    const staleCronJobBinding = createBindingFromClass(StaleDataCronJob);
    this.add(staleCronJobBinding);
  }
}


