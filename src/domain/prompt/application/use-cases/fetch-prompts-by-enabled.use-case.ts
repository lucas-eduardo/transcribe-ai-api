import { Either, right } from '@/core/either'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'
import { Injectable } from '@nestjs/common'

import { PromptRepository } from '../repositories/prompt.repository'

type FetchPromptsByEnabledResponse = Either<null, PromptEntity[]>

@Injectable()
export class FetchPromptsByEnabledUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(): Promise<FetchPromptsByEnabledResponse> {
    const prompts = await this.promptRepository.findByEnabled()

    return right(prompts)
  }
}
