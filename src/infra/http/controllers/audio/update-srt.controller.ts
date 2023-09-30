import { UpdateSrtUseCase } from '@/domain/audio/application/use-cases/update-srt.use-case'
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

const updateSrtBodySchema = z.object({
  srt: z.string(),
})

const updateSrtParamSchema = z.object({
  audioId: z.string().uuid(),
})

type UpdateSrtBodySchema = z.infer<typeof updateSrtBodySchema>
type UpdateSrtParamSchema = z.infer<typeof updateSrtParamSchema>

@Controller('/audios/:audioId/srt')
export class UpdateSrtController {
  constructor(private updateSrt: UpdateSrtUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(
    new ZodValidationPipe([
      {
        schema: updateSrtParamSchema,
        validationType: 'param',
      },
      {
        schema: updateSrtBodySchema,
        validationType: 'body',
      },
    ]),
  )
  async handle(
    @Param() param: UpdateSrtParamSchema,
    @Body() body: UpdateSrtBodySchema,
  ) {
    const { audioId } = param
    const { srt } = body

    const result = await this.updateSrt.execute({
      audioId,
      srt,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
