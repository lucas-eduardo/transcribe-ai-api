import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'

export abstract class PromptRepository {
  abstract find(): Promise<PromptEntity[]>
  abstract findById(promptId: string): Promise<PromptEntity | null>
  abstract findByEnabled(): Promise<PromptEntity[]>
  abstract doesPromptTitleExist(title: string): Promise<boolean>
  abstract doesPromptTitleExistDiffPromptId(
    title: string,
    promptId: string,
  ): Promise<boolean>

  abstract create(prompt: PromptEntity): Promise<void>
  abstract save(prompt: PromptEntity): Promise<void>
}
