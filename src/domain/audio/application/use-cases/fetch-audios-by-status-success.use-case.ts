import { Either, right } from '@/core/either'
import { AudioEntity } from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { AudioRepository } from '../repositories/audio.repository'

type FetchAudiosByStatusSuccessResponse = Either<null, AudioEntity[]>

@Injectable()
export class FetchAudiosByStatusSuccessUseCase {
  constructor(private audioRepository: AudioRepository) {}

  async execute(): Promise<FetchAudiosByStatusSuccessResponse> {
    const audio = await this.audioRepository.findByStatusSuccess()

    return right(audio)
  }
}
