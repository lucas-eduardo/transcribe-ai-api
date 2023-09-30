import { AudioEntity } from '@/domain/audio/enterprise/entities/audio.entity'

export abstract class AudioRepository {
  abstract find(): Promise<AudioEntity[]>
  abstract findById(audioId: string): Promise<AudioEntity | null>
  abstract findByStatusSuccess(): Promise<AudioEntity[]>
  abstract create(audio: AudioEntity): Promise<void>
  abstract save(audio: AudioEntity): Promise<void>
}
