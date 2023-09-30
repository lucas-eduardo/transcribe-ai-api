import { ExecutePromptByAudioUseCase } from '@/domain/audio/application/use-cases/execute-prompt-by-audio.use-case'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common'
import { streamToResponse } from 'ai'
import { Response } from 'express'
import { z } from 'zod'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const executePromptByAudioBodySchema = z.object({
  prompt: z.string(),
  temperature: z.number(),
})

const executePromptByAudioPromptParamSchema = z.object({
  audioId: z.string().uuid(),
})

type ExecutePromptByAudioBodySchema = z.infer<
  typeof executePromptByAudioBodySchema
>
type ExecutePromptByAudioParamSchema = z.infer<
  typeof executePromptByAudioPromptParamSchema
>

@Controller('/audios/:audioId/execute-prompt')
export class ExecutePromptByAudioController {
  constructor(private executePromptByAudio: ExecutePromptByAudioUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(
    new ZodValidationPipe([
      { schema: executePromptByAudioBodySchema, validationType: 'body' },
      {
        schema: executePromptByAudioPromptParamSchema,
        validationType: 'param',
      },
    ]),
  )
  async handle(
    @Param() params: ExecutePromptByAudioParamSchema,
    @Body() body: ExecutePromptByAudioBodySchema,
    @Res() response: Response,
  ) {
    const { audioId } = params
    const { prompt, temperature } = body

    const result = await this.executePromptByAudio.execute({
      audioId,
      prompt,
      temperature,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    streamToResponse(result.value.prompt, response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
      },
    })
  }
}
