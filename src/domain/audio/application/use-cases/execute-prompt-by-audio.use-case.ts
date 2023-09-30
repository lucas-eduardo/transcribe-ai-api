import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { AudioRepository } from '@/domain/audio/application/repositories/audio.repository'
import { Injectable } from '@nestjs/common'

import { ProcessPrompt } from '../process-prompt/process-prompt'

interface IExecutePromptByAudioUseCaseRequest {
  audioId: string
  prompt: string
  temperature?: number
}

type ExecutePromptByAudioUseCaseResponse = Either<
  ResourceNotFoundError,
  { prompt: ReadableStream }
>

@Injectable()
export class ExecutePromptByAudioUseCase {
  constructor(
    private audioRepository: AudioRepository,
    private processPrompt: ProcessPrompt,
  ) {}

  async execute({
    audioId,
    prompt,
    temperature = 0.5,
  }: IExecutePromptByAudioUseCaseRequest): Promise<ExecutePromptByAudioUseCaseResponse> {
    const audio = await this.audioRepository.findById(audioId)

    if (!audio || !audio.transcription) {
      return left(new ResourceNotFoundError())
    }

    const resultPrompt = await this.processPrompt.process({
      prompt,
      transcription: audio.transcription,
      temperature,
    })

    return right({ prompt: resultPrompt })
  }
}
