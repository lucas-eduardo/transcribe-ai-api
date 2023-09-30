import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { makeAudio } from 'test/factories/make-audio.factory'
import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'

import { UpdateSrtUseCase } from '../update-srt.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository

let sut: UpdateSrtUseCase

describe('Upload srt', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()

    sut = new UpdateSrtUseCase(inMemoryAudioRepository)
  })

  it('should update the SRT content for an existing audio', async () => {
    const newAudio = makeAudio({
      srt: 'Content SRT',
    })

    await inMemoryAudioRepository.create(newAudio)

    const audioId = newAudio.id.toString()

    const result = await sut.execute({ audioId, srt: 'Updated SRT' })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        srt: 'Updated SRT',
      }),
    )
  })

  it('should return ResourceNotFoundError when updating SRT for non-existent audio', async () => {
    const newAudio = makeAudio()

    await inMemoryAudioRepository.create(newAudio)

    const result = await sut.execute({ audioId: '123', srt: 'Updated SRT' })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
