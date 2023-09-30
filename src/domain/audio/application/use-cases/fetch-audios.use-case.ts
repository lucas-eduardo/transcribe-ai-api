import { Either, right } from '@/core/either'
import { AudioEntity } from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { AudioRepository } from '../repositories/audio.repository'

type FetchAudiosResponse = Either<null, AudioEntity[]>

@Injectable()
export class FetchAudiosUseCase {
  constructor(private audioRepository: AudioRepository) {}

  async execute(): Promise<FetchAudiosResponse> {
    const audio = await this.audioRepository.find()

    return right(audio)
  }
}
