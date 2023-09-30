import { Either, right } from '@/core/either'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'
import { Injectable } from '@nestjs/common'

import { PromptRepository } from '../repositories/prompt.repository'

type FetchPromptsResponse = Either<null, PromptEntity[]>

@Injectable()
export class FetchPromptsUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(): Promise<FetchPromptsResponse> {
    const prompts = await this.promptRepository.find()

    return right(prompts)
  }
}
