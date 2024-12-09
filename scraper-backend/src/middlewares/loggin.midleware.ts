
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      console.log(`Response status: ${res.statusCode}, Time taken: ${elapsed}ms`);
    });

    next();
  }
}
