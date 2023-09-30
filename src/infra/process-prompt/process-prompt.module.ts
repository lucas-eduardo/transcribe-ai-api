import { ProcessPrompt } from '@/domain/audio/application/process-prompt/process-prompt'
import { Module } from '@nestjs/common'

import { EnvModule } from '../env/env.module'
import { OpenAIProcess } from './openai/openai-process'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: ProcessPrompt,
      useClass: OpenAIProcess,
    },
  ],
  exports: [ProcessPrompt],
})
export class ProcessPromptModule {}
