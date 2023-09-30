import { AudioRepository } from '@/domain/audio/application/repositories/audio.repository'
import {
  AudioEntity,
  AudioStatus,
} from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { PrismaAudioMapper } from '../mappers/prisma-audio.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAudioRepository implements AudioRepository {
  constructor(private prismaService: PrismaService) {}

  async find(): Promise<AudioEntity[]> {
    const audios = await this.prismaService.audio.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return audios.map(PrismaAudioMapper.toDomain)
  }

  async findById(audioId: string): Promise<AudioEntity | null> {
    const audio = await this.prismaService.audio.findUnique({
      where: {
        id: audioId,
      },
    })

    if (!audio) {
      return null
    }

    return PrismaAudioMapper.toDomain(audio)
  }

  async findByStatusSuccess(): Promise<AudioEntity[]> {
    const audios = await this.prismaService.audio.findMany({
      where: {
        status: AudioStatus.success,
      },
    })

    return audios.map(PrismaAudioMapper.toDomain)
  }

  async create(audio: AudioEntity): Promise<void> {
    const data = PrismaAudioMapper.toPrisma(audio)

    await this.prismaService.audio.create({ data })
  }

  async save(audio: AudioEntity): Promise<void> {
    const data = PrismaAudioMapper.toPrisma(audio)

    await this.prismaService.audio.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
