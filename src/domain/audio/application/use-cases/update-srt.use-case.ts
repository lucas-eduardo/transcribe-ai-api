import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { AudioEntity } from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { AudioRepository } from '../repositories/audio.repository'
import { InvalidAudioTypeError } from './errors/invalid-file-type-error'

interface IUpdateSrtUseCaseRequest {
  audioId: string
  srt: string
}

type UpdateSrtResponse = Either<InvalidAudioTypeError, AudioEntity>

@Injectable()
export class UpdateSrtUseCase {
  constructor(private audioRepository: AudioRepository) {}

  async execute({
    audioId,
    srt,
  }: IUpdateSrtUseCaseRequest): Promise<UpdateSrtResponse> {
    const audio = await this.audioRepository.findById(audioId)

    if (!audio) {
      return left(new ResourceNotFoundError())
    }

    audio.srt = srt.trim()

    await this.audioRepository.save(audio)

    return right(audio)
  }
}
