import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import {
  AudioEntity,
  AudioStatus,
} from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { AudioRepository } from '../repositories/audio.repository'
import { Srt } from '../srt-and-transcription/srt'
import { Transcription } from '../srt-and-transcription/transcription'
import { InvalidAudioTypeError } from './errors/invalid-file-type-error'

interface ICreateSrtAndTranscriptionUseCaseRequest {
  audioId: string
  name: string
  prompt: string
}

type CreateSrtAndTranscriptionResponse = Either<
  InvalidAudioTypeError,
  AudioEntity
>

@Injectable()
export class CreateSrtAndTranscriptionUseCase {
  constructor(
    private audioRepository: AudioRepository,
    private srt: Srt,
    private transcription: Transcription,
  ) {}

  async execute({
    audioId,
    name,
    prompt,
  }: ICreateSrtAndTranscriptionUseCaseRequest): Promise<CreateSrtAndTranscriptionResponse> {
    const audio = await this.audioRepository.findById(audioId)

    if (!audio) {
      return left(new ResourceNotFoundError())
    }

    audio.name = name

    try {
      audio.status = AudioStatus.processing

      await this.audioRepository.save(audio)

      const srt = await this.srt.generate({
        fileName: audio.originalName,
        prompt,
      })
      const transcription = await this.transcription.generate({ srt })

      audio.srt = srt
      audio.transcription = transcription
      audio.status = AudioStatus.success

      await this.audioRepository.save(audio)

      return right(audio)
    } catch (error) {
      audio.status = AudioStatus.failed

      await this.audioRepository.save(audio)

      return right(audio)
    }
  }
}
