import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      next();
    } catch (err) {
      console.error('Error occurred:', err.message);
      res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
      });
    }
  }
}

