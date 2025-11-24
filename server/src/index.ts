// src/api/index.ts
import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

let serverInstance: any = null; // express instance

async function bootstrapServer(): Promise<any> {
    if (serverInstance) return serverInstance;

    const app: INestApplication = await NestFactory.create(AppModule, { logger: false });
    await app.init();
    // get the underlying Express (or Fastify) instance that Nest uses
    serverInstance = app.getHttpAdapter().getInstance();
    return serverInstance;
}

// Vercel / @vercel/node expects a default export (req, res)
export default async function handler(req: any, res: any) {
    try {
        const server = await bootstrapServer();
        // forward the request to the express app
        return server(req, res);
    } catch (err) {
        console.error('Serverless handler error', err);
        res.statusCode = 500;
        res.end('Server error');
    }
}
