import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { makeAudio } from 'test/factories/make-audio.factory'
import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'

import { UpdateTranscriptionUseCase } from '../update-transcription.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository

let sut: UpdateTranscriptionUseCase

describe('Upload transcription', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()

    sut = new UpdateTranscriptionUseCase(inMemoryAudioRepository)
  })

  it('should update the transcription content for an existing audio', async () => {
    const newAudio = makeAudio({
      srt: 'Content transcription',
    })

    await inMemoryAudioRepository.create(newAudio)

    const audioId = newAudio.id.toString()

    const result = await sut.execute({
      audioId,
      transcription: 'Updated transcription',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        transcription: 'Updated transcription',
      }),
    )
  })

  it('should return ResourceNotFoundError when updating transcription for non-existent audio', async () => {
    const newAudio = makeAudio()

    await inMemoryAudioRepository.create(newAudio)

    const result = await sut.execute({
      audioId: '123',
      transcription: 'Updated transcription',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
