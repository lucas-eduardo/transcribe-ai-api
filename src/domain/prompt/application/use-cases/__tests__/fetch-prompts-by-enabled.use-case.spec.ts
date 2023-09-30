import { makePrompt } from 'test/factories/make-prompt.factory'
import { InMemoryPromptRepository } from 'test/repositories/in-memory-prompt.repository'

import { FetchPromptsByEnabledUseCase } from '../fetch-prompts-by-enabled.use-case'

let inMemoryPromptRepository: InMemoryPromptRepository

let sut: FetchPromptsByEnabledUseCase

describe('Fetch prompts by enabled', () => {
  beforeEach(() => {
    inMemoryPromptRepository = new InMemoryPromptRepository()

    sut = new FetchPromptsByEnabledUseCase(inMemoryPromptRepository)
  })

  it('should successfully retrieve all enabled prompts when enabled prompts exist', async () => {
    const promptOne = makePrompt()
    const promptTwo = makePrompt()
    const promptThree = makePrompt()

    await inMemoryPromptRepository.create(promptOne)
    await inMemoryPromptRepository.create(promptTwo)
    await inMemoryPromptRepository.create(promptThree)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(3)
    expect(result.value).toEqual([
      expect.objectContaining({ enabled: true, title: promptOne.title }),
      expect.objectContaining({ enabled: true, title: promptTwo.title }),
      expect.objectContaining({ enabled: true, title: promptThree.title }),
    ])
  })

  it('should successfully retrieve only enabled prompts when a mix of enabled and disabled prompts exist', async () => {
    const promptOne = makePrompt({ enabled: false })
    const promptTwo = makePrompt()

    await inMemoryPromptRepository.create(promptOne)
    await inMemoryPromptRepository.create(promptTwo)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(1)
    expect(result.value).toEqual([
      expect.objectContaining({ enabled: true, title: promptTwo.title }),
    ])
  })

  it('should successfully retrieve an empty list when no prompts are enabled', async () => {
    const promptOne = makePrompt({ enabled: false })

    await inMemoryPromptRepository.create(promptOne)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(0)
  })

  it('should successfully retrieve an empty list when no prompts exist in the repository', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(0)
  })
})
