import { Module } from '@nestjs/common'

import { HTTPAudioModule } from './controllers/audio/audio.module'
import { HTTPromptModule } from './controllers/prompt/prompt.module'

@Module({
  imports: [HTTPAudioModule, HTTPromptModule],
})
export class HttpModule {}
