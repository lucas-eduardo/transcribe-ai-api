import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AudioEntity,
  AudioStatus,
} from '@/domain/audio/enterprise/entities/audio.entity'
import { Prisma, Audio as PrismaAudio } from '@prisma/client'

export class PrismaAudioMapper {
  static toDomain(raw: PrismaAudio): AudioEntity {
    return AudioEntity.create(
      {
        originalName: raw.originalName,
        status: raw.status as AudioStatus,
        name: raw.name,
        srt: raw.srt,
        transcription: raw.transcription,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(audio: AudioEntity): Prisma.AudioUncheckedCreateInput {
    return {
      id: audio.id.toString(),
      originalName: audio.originalName,
      name: audio.name,
      status: audio.status,
      srt: audio.srt,
      transcription: audio.transcription,
      createdAt: audio.createdAt,
      updatedAt: audio.updatedAt,
    }
  }
}
