import { FetchPromptsUseCase } from '@/domain/prompt/application/use-cases/fetch-prompts.use-case'
import { PromptPresenter } from '@/infra/http/presenters/prompt.presenter'
import { BadRequestException, Controller, Get } from '@nestjs/common'

@Controller('/prompts')
export class FetchPromptsController {
  constructor(private fetchPrompts: FetchPromptsUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchPrompts.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.map(PromptPresenter.toHTTP)
  }
}
