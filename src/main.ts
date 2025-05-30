import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filter/httpexception';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => {
        const constraints = error.constraints;
        const constraintMessages = constraints
          ? Object.values(constraints).join(', ')
          : 'Validation error';

        return `${error.property} - ${constraintMessages}`;
      });
      return new BadRequestException(messages.join('; '));
    },
  }),
);

  app.useGlobalFilters(new HttpExceptionFilter());

    app.use(helmet());

  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Observe',
      'Authorization',
      'Origin',
    ],
    methods: 'GET,PUT,POST,PATCH,DELETE,UPDATE,OPTIONS',
    credentials: true,
  });


  const options = new DocumentBuilder()
    .setTitle('TaskManagement APIS')
    .setDescription('TaskManagement Endpoints')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, options);

  app.use('/task-management', (req, res) => {
    res.json(swaggerDocument);
  });

  SwaggerModule.setup('/swagger', app, swaggerDocument, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
