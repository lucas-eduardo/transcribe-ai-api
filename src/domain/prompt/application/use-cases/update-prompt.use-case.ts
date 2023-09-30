import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'
import { Injectable } from '@nestjs/common'

import { PromptRepository } from '../repositories/prompt.repository'
import { TitleAlreadyExistsError } from './errors/title-already-exists.error'

interface IUpdatePromptUseCaseRequest {
  promptId: string
  title?: string
  template?: string
}

type UpdatePromptResponse = Either<
  ResourceNotFoundError | TitleAlreadyExistsError,
  PromptEntity
>

@Injectable()
export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute({
    promptId,
    template,
    title,
  }: IUpdatePromptUseCaseRequest): Promise<UpdatePromptResponse> {
    const prompt = await this.promptRepository.findById(promptId)

    if (!prompt) {
      return left(new ResourceNotFoundError())
    }

    if (title) {
      const titleAlreadyExists =
        await this.promptRepository.doesPromptTitleExistDiffPromptId(
          title,
          promptId,
        )

      if (titleAlreadyExists) {
        return left(new TitleAlreadyExistsError(title))
      }
    }

    const updatePrompt = PromptEntity.create(
      {
        title: title ?? prompt.title,
        template: template ?? prompt.title,
      },
      prompt.id,
    )

    await this.promptRepository.save(updatePrompt)

    return right(updatePrompt)
  }
}
