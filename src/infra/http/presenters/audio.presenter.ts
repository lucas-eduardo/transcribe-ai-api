import { AudioEntity } from '@/domain/audio/enterprise/entities/audio.entity'

export class AudioPresenter {
  static toHTTP(audio: AudioEntity) {
    return {
      id: audio.id.toString(),
      title: audio.name,
      srt: audio.srt,
      transcription: audio.transcription,
      createdAt: audio.createdAt,
    }
  }
}
