import {
  IProcessPromptParams,
  ProcessPrompt,
} from '@/domain/audio/application/process-prompt/process-prompt'
import { Readable } from 'node:stream'

export class FakeProcessPrompt implements ProcessPrompt {
  async process({
    prompt,
    transcription,
  }: IProcessPromptParams): Promise<ReadableStream> {
    const readableStream = new Readable()

    readableStream.push(`${prompt}:${transcription}`)
    readableStream.push(null)

    return readableStream as unknown as ReadableStream
  }
}
