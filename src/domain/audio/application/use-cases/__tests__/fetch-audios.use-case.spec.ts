import { makeAudio } from 'test/factories/make-audio.factory'
import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'

import { FetchAudiosUseCase } from '../fetch-audios.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository

let sut: FetchAudiosUseCase

describe('Fetch audios', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()

    sut = new FetchAudiosUseCase(inMemoryAudioRepository)
  })

  it('should fetch all audios when there are multiple audios in the repository', async () => {
    const audioOne = makeAudio()
    const audioTwo = makeAudio()
    const audioThree = makeAudio()

    await inMemoryAudioRepository.create(audioOne)
    await inMemoryAudioRepository.create(audioTwo)
    await inMemoryAudioRepository.create(audioThree)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(3)
    expect(result.value).toEqual([
      expect.objectContaining({ originalName: audioOne.originalName }),
      expect.objectContaining({ originalName: audioTwo.originalName }),
      expect.objectContaining({ originalName: audioThree.originalName }),
    ])
  })

  it('should fetch no audios when the repository is empty', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(0)
  })
})
