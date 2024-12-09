import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UrlModule } from './url/url.module';
import { MediaModule } from './media/media.module';
import { LoggingMiddleware } from './middlewares/loggin.midleware';
import { ErrorHandlingMiddleware } from './middlewares/errorHandling.middleware';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [PrismaModule, UrlModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, LoggingMiddleware, ErrorHandlingMiddleware)
      .forRoutes('*');
  }
}
