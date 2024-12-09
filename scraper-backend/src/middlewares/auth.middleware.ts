import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!this.validateToken(token)) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }

  private validateToken(token: string): boolean {
    console.log("xxxx ", token)
    return token === 'yyy';
  }
}

