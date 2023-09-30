import { UpdateTranscriptionUseCase } from '@/domain/audio/application/use-cases/update-transcription.use-case'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateTranscriptionBodySchema = z.object({
  transcription: z.string(),
})

const updateTranscriptionParamSchema = z.object({
  audioId: z.string().uuid(),
})

type UpdateTranscriptionBodySchema = z.infer<
  typeof updateTranscriptionBodySchema
>
type UpdateTranscriptionParamSchema = z.infer<
  typeof updateTranscriptionParamSchema
>

@Controller('/audios/:audioId/transcription')
export class UpdateTranscriptionController {
  constructor(private updateTranscription: UpdateTranscriptionUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(
    new ZodValidationPipe([
      {
        schema: updateTranscriptionParamSchema,
        validationType: 'param',
      },
      {
        schema: updateTranscriptionBodySchema,
        validationType: 'body',
      },
    ]),
  )
  async handle(
    @Param() param: UpdateTranscriptionParamSchema,
    @Body() body: UpdateTranscriptionBodySchema,
  ) {
    const { audioId } = param
    const { transcription } = body

    const result = await this.updateTranscription.execute({
      audioId,
      transcription,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
