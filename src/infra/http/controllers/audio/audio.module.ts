import { CreateSrtAndTranscriptionUseCase } from '@/domain/audio/application/use-cases/create-srt-and-transcription.use-case'
import { FetchAudiosByStatusSuccessUseCase } from '@/domain/audio/application/use-cases/fetch-audios-by-status-success.use-case'
import { FetchAudiosUseCase } from '@/domain/audio/application/use-cases/fetch-audios.use-case'
import { UpdateSrtUseCase } from '@/domain/audio/application/use-cases/update-srt.use-case'
import { UpdateTranscriptionUseCase } from '@/domain/audio/application/use-cases/update-transcription.use-case'
import { UploadAndCreateAudioUseCase } from '@/domain/audio/application/use-cases/upload-and-create-audio.use-case'
import { DatabaseModule } from '@/infra/database/database.module'
import { SrtTranscriptionModule } from '@/infra/srt-and-transcription/srt-transcription.module'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'

import { CreateSrtAndTranscriptionController } from './create-srt-and-transcription.controller'
import { FetchAudiosByStatusSuccessController } from './fetch-audios-by-status-success.controller'
import { FetchAudiosController } from './fetch-audios.controller'
import { UpdateSrtController } from './update-srt.controller'
import { UpdateTranscriptionController } from './update-transcription.controller'
import { UploadAndCreateAudioController } from './upload-and-create-audio.controller'

@Module({
  imports: [DatabaseModule, StorageModule, SrtTranscriptionModule],
  controllers: [
    UploadAndCreateAudioController,
    CreateSrtAndTranscriptionController,
    UpdateTranscriptionController,
    UpdateSrtController,
    FetchAudiosController,
    FetchAudiosByStatusSuccessController,
  ],
  providers: [
    UploadAndCreateAudioUseCase,
    CreateSrtAndTranscriptionUseCase,
    UpdateTranscriptionUseCase,
    UpdateSrtUseCase,
    FetchAudiosUseCase,
    FetchAudiosByStatusSuccessUseCase,
  ],
})
export class HTTPAudioModule {}
