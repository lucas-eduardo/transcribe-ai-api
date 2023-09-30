import { Srt } from '@/domain/audio/application/srt-and-transcription/srt'
import { Transcription } from '@/domain/audio/application/srt-and-transcription/transcription'
import { Module } from '@nestjs/common'

import { EnvModule } from '../env/env.module'
import { LocalTranscription } from './local/local-transcription'
import { OpenAISrt } from './openai/openai-srt'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Srt,
      useClass: OpenAISrt,
    },
    {
      provide: Transcription,
      useClass: LocalTranscription,
    },
  ],
  exports: [Srt, Transcription],
})
export class SrtTranscriptionModule {}
