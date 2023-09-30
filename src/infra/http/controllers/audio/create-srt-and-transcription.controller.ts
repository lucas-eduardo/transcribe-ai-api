import { CreateSrtAndTranscriptionUseCase } from '@/domain/audio/application/use-cases/create-srt-and-transcription.use-case'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createSrtAndTranscriptionBodySchema = z.object({
  name: z.string(),
  prompt: z.string(),
})

const updatePromptParamSchema = z.object({
  audioId: z.string().uuid(),
})

type CreateSrtAndTranscriptionBodySchema = z.infer<
  typeof createSrtAndTranscriptionBodySchema
>
type UpdatePromptParamSchema = z.infer<typeof updatePromptParamSchema>

@Controller('/audios/:audioId/str-transcription')
export class CreateSrtAndTranscriptionController {
  constructor(
    private createSrtAndTranscription: CreateSrtAndTranscriptionUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(
    new ZodValidationPipe([
      { schema: createSrtAndTranscriptionBodySchema, validationType: 'body' },
      { schema: updatePromptParamSchema, validationType: 'param' },
    ]),
  )
  async handle(
    @Param() params: UpdatePromptParamSchema,
    @Body() body: CreateSrtAndTranscriptionBodySchema,
  ) {
    const { audioId } = params
    const { name, prompt } = body

    const result = await this.createSrtAndTranscription.execute({
      audioId,
      name,
      prompt,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
