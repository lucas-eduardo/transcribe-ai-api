import {
  IProcessPromptParams,
  ProcessPrompt,
} from '@/domain/audio/application/process-prompt/process-prompt'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { OpenAIStream } from 'ai'
import { OpenAI } from 'openai'

@Injectable()
export class OpenAIProcess implements ProcessPrompt {
  private client: OpenAI

  constructor(private envService: EnvService) {
    const apiKey = this.envService.get('OPENAI_KEY')

    this.client = new OpenAI({
      apiKey,
    })
  }

  async process({
    prompt,
    transcription,
    temperature,
  }: IProcessPromptParams): Promise<ReadableStream> {
    const content = prompt.replace('{transcription}', transcription)

    const response = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      temperature,
      messages: [{ role: 'user', content }],
      stream: true,
    })

    const stream = OpenAIStream(response as never)

    return stream
  }
}
