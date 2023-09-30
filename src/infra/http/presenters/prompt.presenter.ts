import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'

export class PromptPresenter {
  static toHTTP(prompt: PromptEntity) {
    return {
      id: prompt.id.toString(),
      title: prompt.title,
      template: prompt.template,
      createdAt: prompt.createdAt,
    }
  }
}
