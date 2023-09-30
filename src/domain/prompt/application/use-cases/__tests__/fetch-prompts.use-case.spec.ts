import { makePrompt } from 'test/factories/make-prompt.factory'
import { InMemoryPromptRepository } from 'test/repositories/in-memory-prompt.repository'

import { FetchPromptsUseCase } from '../fetch-prompts.use-case'

let inMemoryPromptRepository: InMemoryPromptRepository

let sut: FetchPromptsUseCase

describe('Fetch prompts', () => {
  beforeEach(() => {
    inMemoryPromptRepository = new InMemoryPromptRepository()

    sut = new FetchPromptsUseCase(inMemoryPromptRepository)
  })

  it('should successfully retrieve all active prompts when prompts exist', async () => {
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

  it('should successfully retrieve an empty list when no active prompts exist', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toHaveLength(0)
  })
})
