import { TitleAlreadyExistsError } from '@/domain/prompt/application/use-cases/errors/title-already-exists.error'
import { UpdatePromptUseCase } from '@/domain/prompt/application/use-cases/update-prompt.use-case'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updatePromptBodySchema = z
  .object({
    title: z.string().optional(),
    template: z.string().optional(),
  })
  .refine((data) => data.title || data.template)

const updatePromptParamSchema = z.object({
  promptId: z.string().uuid(),
})

type UpdatePromptBodySchema = z.infer<typeof updatePromptBodySchema>
type UpdatePromptParamSchema = z.infer<typeof updatePromptParamSchema>

@Controller('/prompts/:promptId')
export class UpdatePromptController {
  constructor(private updatePrompt: UpdatePromptUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(
    new ZodValidationPipe([
      {
        schema: updatePromptParamSchema,
        validationType: 'param',
      },
      {
        schema: updatePromptBodySchema,
        validationType: 'body',
      },
    ]),
  )
  async handle(
    @Param() param: UpdatePromptParamSchema,
    @Body() body: UpdatePromptBodySchema,
  ) {
    const { promptId } = param
    const { title, template } = body

    const result = await this.updatePrompt.execute({
      promptId,
      title,
      template,
    })

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
