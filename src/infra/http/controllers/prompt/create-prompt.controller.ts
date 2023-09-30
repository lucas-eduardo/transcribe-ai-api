import { CreatePromptUseCase } from '@/domain/prompt/application/use-cases/create-prompt.use-case'
import { TitleAlreadyExistsError } from '@/domain/prompt/application/use-cases/errors/title-already-exists.error'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createPromptBodySchema = z.object({
  title: z.string(),
  template: z.string(),
})

type CreatePromptBodySchema = z.infer<typeof createPromptBodySchema>

@Controller('/prompts')
export class CreatePromptController {
  constructor(private createPrompt: CreatePromptUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPromptBodySchema))
  async handle(@Body() body: CreatePromptBodySchema) {
    const { title, template } = body

    const result = await this.createPrompt.execute({ title, template })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case TitleAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
