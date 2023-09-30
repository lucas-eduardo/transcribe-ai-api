import {
  ISrtParams,
  Srt,
} from '@/domain/audio/application/srt-and-transcription/srt'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { createReadStream } from 'node:fs'
import { resolve } from 'node:path'
import { OpenAI } from 'openai'

@Injectable()
export class OpenAISrt implements Srt {
  private client: OpenAI

  constructor(private envService: EnvService) {
    const apiKey = this.envService.get('OPENAI_KEY')

    this.client = new OpenAI({
      apiKey,
    })
  }

  async generate({ fileName, prompt }: ISrtParams): Promise<string> {
    const audioReadStream = createReadStream(this.pathAudio(fileName))

    const response = await this.client.audio.transcriptions.create({
      file: audioReadStream,
      model: 'whisper-1',
      language: 'pt',
      response_format: 'srt',
      temperature: 0,
      prompt,
    })

    const srt = response as unknown as string

    return srt.trim()
  }

  private pathAudio(fileName: string) {
    return resolve(__dirname, '../../../../temp', fileName)
  }
}
