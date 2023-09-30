import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AudioEntity,
  AudioStatus,
  IAudioProps,
} from '@/domain/audio/enterprise/entities/audio.entity'
import { PrismaAudioMapper } from '@/infra/database/prisma/mappers/prisma-audio.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

export function makeAudio(
  override: Partial<IAudioProps> = {},
  id?: UniqueEntityID,
) {
  const audio = AudioEntity.create(
    {
      status: AudioStatus.pending,
      originalName: `audio_${randomUUID()}.mp3`,
      ...override,
    },
    id,
  )

  return audio
}

@Injectable()
export class AudioFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAudio(data: Partial<IAudioProps> = {}): Promise<AudioEntity> {
    const audio = makeAudio(data)

    await this.prisma.audio.create({
      data: PrismaAudioMapper.toPrisma(audio),
    })

    return audio
  }
}
