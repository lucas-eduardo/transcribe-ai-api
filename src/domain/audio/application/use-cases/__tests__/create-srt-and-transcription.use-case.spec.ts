import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { AudioStatus } from '@/domain/audio/enterprise/entities/audio.entity'
import { makeAudio } from 'test/factories/make-audio.factory'
import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'
import { FakeSrt } from 'test/srt-and-transcription/fake-srt'
import { FakeTranscription } from 'test/srt-and-transcription/fake-transcription'

import { CreateSrtAndTranscriptionUseCase } from '../create-srt-and-transcription.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository
let fakeSrt: FakeSrt
let fakeTranscription: FakeTranscription

let sut: CreateSrtAndTranscriptionUseCase

describe('Create srt and transcription', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()
    fakeSrt = new FakeSrt()
    fakeTranscription = new FakeTranscription()

    sut = new CreateSrtAndTranscriptionUseCase(
      inMemoryAudioRepository,
      fakeSrt,
      fakeTranscription,
    )
  })

  it('should return a valid result when processing existing audio', async () => {
    const newAudio = makeAudio()

    await inMemoryAudioRepository.create(newAudio)

    const audioId = newAudio.id.toString()

    const result = await sut.execute({
      audioId,
      name: 'Audio name',
      prompt: 'Audio prompt',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        name: 'Audio name',
        status: AudioStatus.success,
        srt: inMemoryAudioRepository.audios[0].srt,
        transcription: inMemoryAudioRepository.audios[0].transcription,
      }),
    )
    expect(inMemoryAudioRepository.audios[0].srt).toContain('Audio prompt')
  })

  it('should return a ResourceNotFoundError when processing non-existent audio', async () => {
    const newAudio = makeAudio()

    await inMemoryAudioRepository.create(newAudio)

    const result = await sut.execute({
      audioId: '123',
      name: 'Audio name',
      prompt: 'Audio prompt',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should handle failure during SRT generation and mark audio as failed', async () => {
    const newAudio = makeAudio()

    await inMemoryAudioRepository.create(newAudio)

    vi.spyOn(fakeSrt, 'generate').mockRejectedValue('')

    const audioId = newAudio.id.toString()

    const result = await sut.execute({
      audioId,
      name: 'Audio name',
      prompt: 'Audio prompt',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        status: AudioStatus.failed,
      }),
    )
  })

  it('should handle failure during transcription generation and mark audio as failed', async () => {
    const newAudio = makeAudio()

    await inMemoryAudioRepository.create(newAudio)

    vi.spyOn(fakeTranscription, 'generate').mockRejectedValue('')

    const audioId = newAudio.id.toString()

    const result = await sut.execute({
      audioId,
      name: 'Audio name',
      prompt: 'Audio prompt',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        status: AudioStatus.failed,
      }),
    )
  })
})
