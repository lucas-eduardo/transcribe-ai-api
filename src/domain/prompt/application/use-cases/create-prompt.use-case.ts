import { Either, left, right } from '@/core/either'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'
import { Injectable } from '@nestjs/common'

import { PromptRepository } from '../repositories/prompt.repository'
import { TitleAlreadyExistsError } from './errors/title-already-exists.error'

interface ICreatePromptUseCaseRequest {
  title: string
  template: string
}

type CreatePromptResponse = Either<TitleAlreadyExistsError, PromptEntity>

@Injectable()
export class CreatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute({
    template,
    title,
  }: ICreatePromptUseCaseRequest): Promise<CreatePromptResponse> {
    const titleAlreadyExists =
      await this.promptRepository.doesPromptTitleExist(title)

    if (titleAlreadyExists) {
      return left(new TitleAlreadyExistsError(title))
    }

    const prompt = PromptEntity.create({ title, template })

    await this.promptRepository.create(prompt)

    return right(prompt)
  }
}
