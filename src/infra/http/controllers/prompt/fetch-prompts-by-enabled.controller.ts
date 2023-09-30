import { FetchPromptsByEnabledUseCase } from '@/domain/prompt/application/use-cases/fetch-prompts-by-enabled.use-case'
import { PromptPresenter } from '@/infra/http/presenters/prompt.presenter'
import { BadRequestException, Controller, Get } from '@nestjs/common'

@Controller('/prompts/enabled')
export class FetchPromptsByEnabledController {
  constructor(private fetchPromptsByEnabled: FetchPromptsByEnabledUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchPromptsByEnabled.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.map(PromptPresenter.toHTTP)
  }
}
