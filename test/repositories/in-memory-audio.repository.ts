import { AudioRepository } from '@/domain/audio/application/repositories/audio.repository'
import {
  AudioEntity,
  AudioStatus,
} from '@/domain/audio/enterprise/entities/audio.entity'

export class InMemoryAudioRepository implements AudioRepository {
  audios: AudioEntity[] = []

  async find() {
    return this.audios
  }

  async findById(audioId: string): Promise<AudioEntity | null> {
    const audio = this.audios.find((item) => item.id.toString() === audioId)

    if (!audio) {
      return null
    }

    return audio
  }

  async findByStatusSuccess(): Promise<AudioEntity[]> {
    return this.audios.filter((audio) => audio.status === AudioStatus.success)
  }

  async create(audio: AudioEntity) {
    this.audios.push(audio)
  }

  async save(audio: AudioEntity): Promise<void> {
    const audioIndex = this.audios.findIndex((item) => item.id === audio.id)

    this.audios[audioIndex] = audio
  }
}
