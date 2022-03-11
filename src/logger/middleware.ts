import {Next, Provider} from '@loopback/core';
import {Middleware, RequestContext} from '@loopback/rest';
import { logger } from '.';
export class LogMiddleware implements Provider<Middleware> {
  value(): Middleware {
    return async (ctx, next) => {
      return this.action(ctx as RequestContext, next);
    };
  }
  async action(requestCtx: RequestContext, next: Next) {
    const {request} = requestCtx;
    const requestTime = Date.now();
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
      return result;
    } catch (err) {
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
