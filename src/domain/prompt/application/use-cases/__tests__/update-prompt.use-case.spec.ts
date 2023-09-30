import { makePrompt } from 'test/factories/make-prompt.factory'
import { InMemoryPromptRepository } from 'test/repositories/in-memory-prompt.repository'

import { TitleAlreadyExistsError } from '../errors/title-already-exists.error'
import { UpdatePromptUseCase } from '../update-prompt.use-case'

let inMemoryPromptRepository: InMemoryPromptRepository

let sut: UpdatePromptUseCase

describe('Update prompt', () => {
  beforeEach(() => {
    inMemoryPromptRepository = new InMemoryPromptRepository()

    sut = new UpdatePromptUseCase(inMemoryPromptRepository)
  })

  it('should successfully update the title and template of a prompt', async () => {
    const promptOne = makePrompt()

    await inMemoryPromptRepository.create(promptOne)

    const promptId = promptOne.id.toString()

    const result = await sut.execute({
      promptId,
      title: 'Updated Title',
      template: 'Updated Template',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        title: 'Updated Title',
        template: 'Updated Template',
      }),
    )
  })

  it('should successfully update only the title of a prompt', async () => {
    const promptOne = makePrompt()

    await inMemoryPromptRepository.create(promptOne)

    const promptId = promptOne.id.toString()

    const result = await sut.execute({
      promptId,
      title: 'Updated Title',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        title: 'Updated Title',
        template: inMemoryPromptRepository.prompts[0].template,
      }),
    )
  })

  it('should successfully update only the template of a prompt', async () => {
    const promptOne = makePrompt()

    await inMemoryPromptRepository.create(promptOne)

    const promptId = promptOne.id.toString()

    const result = await sut.execute({
      promptId,
      template: 'Updated Template',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        title: inMemoryPromptRepository.prompts[0].title,
        template: 'Updated Template',
      }),
    )
  })

  it('should fail to update the title of a prompt when the new title already exists', async () => {
    const promptOne = makePrompt()
    const promptTwo = makePrompt()

    await inMemoryPromptRepository.create(promptOne)
    await inMemoryPromptRepository.create(promptTwo)

    const promptId = promptOne.id.toString()

    const result = await sut.execute({
      promptId,
      title: promptTwo.title,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(TitleAlreadyExistsError)
  })
})
