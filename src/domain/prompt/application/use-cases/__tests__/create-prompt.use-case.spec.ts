import { makePrompt } from 'test/factories/make-prompt.factory'
import { InMemoryPromptRepository } from 'test/repositories/in-memory-prompt.repository'

import { CreatePromptUseCase } from '../create-prompt.use-case'
import { TitleAlreadyExistsError } from '../errors/title-already-exists.error'

let inMemoryPromptRepository: InMemoryPromptRepository

let sut: CreatePromptUseCase

describe('Create prompt', () => {
  beforeEach(() => {
    inMemoryPromptRepository = new InMemoryPromptRepository()

    sut = new CreatePromptUseCase(inMemoryPromptRepository)
  })

  it('should successfully add a new prompt with specified title and template', async () => {
    const result = await sut.execute({
      title: 'Title Prompt',
      template: 'Template Prompt',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        enabled: true,
        title: 'Title Prompt',
        template: 'Template Prompt',
      }),
    )
  })

  it('should fail to add a prompt when a prompt with the same title already exists', async () => {
    const newPrompt = makePrompt({ title: 'Title Prompt' })

    await inMemoryPromptRepository.create(newPrompt)

    const result = await sut.execute({
      title: 'Title Prompt',
      template: 'Template Prompt',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(TitleAlreadyExistsError)
  })
})
