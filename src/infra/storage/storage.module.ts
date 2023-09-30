import { Uploader } from '@/domain/audio/application/storage/uploader'
import { Module } from '@nestjs/common'

import { EnvModule } from '../env/env.module'
import { LocalStorage } from './local'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: LocalStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
