import {Next, Provider} from '@loopback/core';
import {Middleware, RequestContext} from '@loopback/rest';
import {logger} from '.';

/**
 * Log the incoming request
 * This class will be bound to the application as a provider
 * @export
 * @class LogMiddleware
 * @implements {Provider<Middleware>}
 */
export class LogMiddleware implements Provider<Middleware> {

  /**
   * Get the middleware function
   * @returns {Middleware} - return the middleware function
   * @memberof LogMiddleware
   */
  value(): Middleware {
    return async (ctx, next) => {
      return this.action(ctx as RequestContext, next);
    };
  }

  /**
   * Log the incoming request
   * @param {RequestContext} requestCtx
   * @param {Next} next - next function
   * @returns - return next function
   * @memberof LogMiddleware
   */
  async action(requestCtx: RequestContext, next: Next) {

    // get request object
    const {request} = requestCtx;

    // get DateTime Now.
    const requestTime = Date.now();

    // log request
    logger.info(
      `Request ${request.method} ${request.url
      } started at ${requestTime.toString()}.
      Request Details
      Referer = ${request.headers.referer}
      User-Agent = ${request.headers['user-agent']}
      Remote Address = ${request.connection.remoteAddress}
      Remote Address (Proxy) = ${request.headers['x-forwarded-for']}`,
    );
    try {
      // Proceed with next middleware
      const result = await next();

      // return result from next middleware
      return result;
    } catch (err) {

      // log error
      logger.error(
        `Request ${request.method} ${request.url
        } errored out. Error :: ${JSON.stringify(err)} ${err}`,
      );
      throw err;
    }
    finally {
      logger.info(
        `Request ${request.method} ${request.url
        } Completed in ${Date.now() - requestTime}ms`,
      );
    }
  }
}
