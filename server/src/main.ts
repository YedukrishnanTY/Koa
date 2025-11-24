import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
const express = require('express'); 
import serverless from 'serverless-http';
import { AppModule } from './app.module';

const expressApp = express();

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await app.init();
}
bootstrap().catch(err => {
    console.error('Nest bootstrap error', err);
});

export default serverless(expressApp);