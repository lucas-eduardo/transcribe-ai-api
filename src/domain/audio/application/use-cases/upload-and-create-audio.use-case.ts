import { Either, left, right } from '@/core/either'
import {
  AudioEntity,
  AudioStatus,
} from '@/domain/audio/enterprise/entities/audio.entity'
import { Injectable } from '@nestjs/common'

import { AudioRepository } from '../repositories/audio.repository'
import { Uploader } from '../storage/uploader'
import { InvalidAudioTypeError } from './errors/invalid-file-type-error'

interface IUploadAndCreateAudioUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateAudioResponse = Either<InvalidAudioTypeError, AudioEntity>

@Injectable()
export class UploadAndCreateAudioUseCase {
  constructor(
    private audioRepository: AudioRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: IUploadAndCreateAudioUseCaseRequest): Promise<UploadAndCreateAudioResponse> {
    if (!/^(audio\/(mp3|mpeg))$/.test(fileType)) {
      return left(new InvalidAudioTypeError(fileType))
    }

    const { name } = await this.uploader.upload({ body, fileName, fileType })

    const audio = AudioEntity.create({
      status: AudioStatus.pending,
      originalName: name,
    })

    await this.audioRepository.create(audio)

    return right(audio)
  }
}
