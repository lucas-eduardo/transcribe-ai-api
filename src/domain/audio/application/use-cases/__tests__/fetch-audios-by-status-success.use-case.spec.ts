import { AudioStatus } from '@/domain/audio/enterprise/entities/audio.entity'
import { makeAudio } from 'test/factories/make-audio.factory'
import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'

import { FetchAudiosByStatusSuccessUseCase } from '../fetch-audios-by-status-success.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository

let sut: FetchAudiosByStatusSuccessUseCase

describe('Fetch audios by status success', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()

    sut = new FetchAudiosByStatusSuccessUseCase(inMemoryAudioRepository)
  })

  it('should fetch all audios with success status when there are multiple successful audios in the repository', async () => {
    const audioOne = makeAudio({ status: AudioStatus.success })
    const audioTwo = makeAudio({ status: AudioStatus.success })
    const audioThree = makeAudio({ status: AudioStatus.success })

    await inMemoryAudioRepository.create(audioOne)
    await inMemoryAudioRepository.create(audioTwo)
    await inMemoryAudioRepository.create(audioThree)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(3)
    expect(result.value).toEqual([
      expect.objectContaining({
        status: AudioStatus.success,
        originalName: audioOne.originalName,
      }),
      expect.objectContaining({
        status: AudioStatus.success,
        originalName: audioTwo.originalName,
      }),
      expect.objectContaining({
        status: AudioStatus.success,
        originalName: audioThree.originalName,
      }),
    ])
  })

  it('should fetch only successful audios when there are mixed statuses in the repository', async () => {
    const audioOne = makeAudio({ status: AudioStatus.success })
    const audioTwo = makeAudio({ status: AudioStatus.pending })

    await inMemoryAudioRepository.create(audioOne)
    await inMemoryAudioRepository.create(audioTwo)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(1)
    expect(result.value).toEqual([
      expect.objectContaining({
        status: AudioStatus.success,
        originalName: audioOne.originalName,
      }),
    ])
  })

  it('should fetch only successful audios even if there are failed audios in the repository', async () => {
    const audioOne = makeAudio({ status: AudioStatus.success })
    const audioTwo = makeAudio({ status: AudioStatus.failed })

    await inMemoryAudioRepository.create(audioOne)
    await inMemoryAudioRepository.create(audioTwo)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(1)
    expect(result.value).toEqual([
      expect.objectContaining({
        status: AudioStatus.success,
        originalName: audioOne.originalName,
      }),
    ])
  })

  it('should fetch only successful audios even if there are processing audios in the repository', async () => {
    const audioOne = makeAudio({ status: AudioStatus.success })
    const audioTwo = makeAudio({ status: AudioStatus.processing })

    await inMemoryAudioRepository.create(audioOne)
    await inMemoryAudioRepository.create(audioTwo)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(1)
    expect(result.value).toEqual([
      expect.objectContaining({
        status: AudioStatus.success,
        originalName: audioOne.originalName,
      }),
    ])
  })

  it('should fetch no audios when the repository is empty', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(0)
  })
})
