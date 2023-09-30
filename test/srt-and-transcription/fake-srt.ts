import {
  ISrtParams,
  Srt,
} from '@/domain/audio/application/srt-and-transcription/srt'

export class FakeSrt implements Srt {
  async generate({ fileName, prompt }: ISrtParams): Promise<string> {
    return `1
00:00:10,000 --> 00:00:16,700
Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${prompt}

2
00:00:16,700 --> 00:00:17,700
Lorem ipsum. ${fileName}`
  }
}
