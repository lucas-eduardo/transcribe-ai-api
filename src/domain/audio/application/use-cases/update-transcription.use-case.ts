import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { AudioEntity } from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { AudioRepository } from '../repositories/audio.repository'

interface IUpdateTranscriptionUseCaseRequest {
  audioId: string
  transcription: string
}

type UpdateTranscriptionResponse = Either<ResourceNotFoundError, AudioEntity>

@Injectable()
export class UpdateTranscriptionUseCase {
  constructor(private audioRepository: AudioRepository) {}

  async execute({
    audioId,
    transcription,
  }: IUpdateTranscriptionUseCaseRequest): Promise<UpdateTranscriptionResponse> {
    const audio = await this.audioRepository.findById(audioId)

    if (!audio) {
      return left(new ResourceNotFoundError())
    }

    audio.transcription = transcription.trim()

    await this.audioRepository.save(audio)

    return right(audio)
  }
}
