import { CreatePromptUseCase } from '@/domain/prompt/application/use-cases/create-prompt.use-case'
import { FetchPromptsByEnabledUseCase } from '@/domain/prompt/application/use-cases/fetch-prompts-by-enabled.use-case'
import { FetchPromptsUseCase } from '@/domain/prompt/application/use-cases/fetch-prompts.use-case'
import { UpdatePromptUseCase } from '@/domain/prompt/application/use-cases/update-prompt.use-case'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'

import { CreatePromptController } from './create-prompt.controller'
import { FetchPromptsByEnabledController } from './fetch-prompts-by-enabled.controller'
import { FetchPromptsController } from './fetch-prompts.controller'
import { UpdatePromptController } from './update-prompt.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreatePromptController,
    UpdatePromptController,
    FetchPromptsController,
    FetchPromptsByEnabledController,
  ],
  providers: [
    CreatePromptUseCase,
    UpdatePromptUseCase,
    FetchPromptsUseCase,
    FetchPromptsByEnabledUseCase,
  ],
})
export class HTTPromptModule {}
