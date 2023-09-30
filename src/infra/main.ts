import { NestFactory } from '@nestjs/core'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const pathTemp = resolve(__dirname, '../../temp')

  const existFolderTemp = existsSync(pathTemp)

  if (!existFolderTemp) {
    mkdirSync(pathTemp)
  }

  const app = await NestFactory.create(AppModule)

  app.enableCors()

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}

bootstrap()
