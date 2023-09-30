import {
  ITranscriptionParams,
  Transcription,
} from '@/domain/audio/application/srt-and-transcription/transcription'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LocalTranscription implements Transcription {
  async generate({ srt }: ITranscriptionParams): Promise<string> {
    const regex =
      /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g

    const transcription = srt.replace(regex, '').trim()

    return transcription
  }
}
