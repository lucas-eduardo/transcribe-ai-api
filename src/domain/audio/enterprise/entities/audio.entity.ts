import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum AudioStatus {
  pending = 'pending',
  processing = 'processing',
  success = 'success',
  failed = 'failed',
}

export interface IAudioProps {
  status: AudioStatus

  name?: string | null
  originalName: string

  transcription?: string | null
  srt?: string | null

  createdAt: Date
  updatedAt?: Date | null
}

export class AudioEntity extends Entity<IAudioProps> {
  get status() {
    return this.props.status
  }

  set status(status: AudioStatus) {
    this.props.status = status
  }

  get name() {
    return this.props.name
  }

  set name(name: string | null | undefined) {
    this.props.name = name
  }

  get originalName() {
    return this.props.originalName
  }

  get transcription() {
    return this.props.transcription
  }

  set transcription(transcription: string | null | undefined) {
    this.props.transcription = transcription
  }

  get srt() {
    return this.props.srt
  }

  set srt(str: string | null | undefined) {
    this.props.srt = str
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<IAudioProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const audio = new AudioEntity(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return audio
  }
}
