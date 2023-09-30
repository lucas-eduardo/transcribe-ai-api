import { AudioRepository } from '@/domain/audio/application/repositories/audio.repository'
import { PromptRepository } from '@/domain/prompt/application/repositories/prompt.repository'
import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAudioRepository } from './prisma/repositories/prisma-audio.repository'
import { PrismaPromptRepository } from './prisma/repositories/prisma-prompt.repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: PromptRepository,
      useClass: PrismaPromptRepository,
    },
    {
      provide: AudioRepository,
      useClass: PrismaAudioRepository,
    },
  ],
  exports: [PrismaService, PromptRepository, AudioRepository],
})
export class DatabaseModule {}
