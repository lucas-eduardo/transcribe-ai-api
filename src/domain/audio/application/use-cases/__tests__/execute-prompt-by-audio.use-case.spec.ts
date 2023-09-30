import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found.error'
import { Readable } from 'node:stream'
import { makeAudio } from 'test/factories/make-audio.factory'
import { FakeProcessPrompt } from 'test/process-prompt/fake-process-prompt'
import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'

import { ExecutePromptByAudioUseCase } from '../execute-prompt-by-audio.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository
let fakeProcessPrompt: FakeProcessPrompt

let sut: ExecutePromptByAudioUseCase

function streamToString(stream: Readable) {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []

    stream.on('data', (chunk) => chunks.push(chunk))

    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))

    stream.on('error', reject)
  })
}

describe('Execute prompt by audio', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()
    fakeProcessPrompt = new FakeProcessPrompt()

    sut = new ExecutePromptByAudioUseCase(
      inMemoryAudioRepository,
      fakeProcessPrompt,
    )
  })

  it('should successfully execute a prompt by audio with valid parameters', async () => {
    const newAudio = makeAudio({
      transcription: 'Test transcription',
    })

    await inMemoryAudioRepository.create(newAudio)

    const audioId = newAudio.id.toString()

    const result = await sut.execute({
      audioId,
      prompt: 'Test prompt',
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      const promptValue = await streamToString(
        result.value.prompt as unknown as Readable,
      )

      expect(promptValue).toBe('Test prompt:Test transcription')
    }
  })

  it('should return a ResourceNotFoundError for an invalid audioId', async () => {
    const newAudio = makeAudio({
      transcription: 'Test transcription',
    })

    await inMemoryAudioRepository.create(newAudio)

    const result = await sut.execute({
      audioId: '123',
      prompt: 'Test prompt',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
