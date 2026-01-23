import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventsService } from './events/events.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Seed database on startup
  const eventsService = app.get(EventsService);
  await eventsService.seed();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`✓ Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();

