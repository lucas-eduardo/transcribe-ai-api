import { PromptRepository } from '@/domain/prompt/application/repositories/prompt.repository'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'

export class InMemoryPromptRepository implements PromptRepository {
  prompts: PromptEntity[] = []

  async find() {
    return this.prompts
  }

  async findById(promptId: string): Promise<PromptEntity | null> {
    const prompt = this.prompts.find(
      (prompt) => prompt.id.toString() === promptId,
    )

    if (!prompt) {
      return null
    }

    return prompt
  }

  async findByEnabled(): Promise<PromptEntity[]> {
    return this.prompts.filter((prompt) => prompt.enabled)
  }

  async doesPromptTitleExist(title: string): Promise<boolean> {
    const prompt = this.prompts.find((prompt) => prompt.title === title)

    return !!prompt
  }

  async doesPromptTitleExistDiffPromptId(
    title: string,
    promptId: string,
  ): Promise<boolean> {
    const prompt = this.prompts.find(
      (prompt) => prompt.title === title && prompt.id.toString() !== promptId,
    )

    return !!prompt
  }

  async create(prompt: PromptEntity) {
    this.prompts.push(prompt)
  }

  async save(prompt: PromptEntity): Promise<void> {
    const promptIndex = this.prompts.findIndex((item) => item.id === prompt.id)

    this.prompts[promptIndex] = prompt
  }
}
