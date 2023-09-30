import { FetchAudiosByStatusSuccessUseCase } from '@/domain/audio/application/use-cases/fetch-audios-by-status-success.use-case'
import { BadRequestException, Controller, Get } from '@nestjs/common'

import { AudioPresenter } from '../../presenters/audio.presenter'

@Controller('/audios/success')
export class FetchAudiosByStatusSuccessController {
  constructor(
    private fetchAudiosByStatusSuccess: FetchAudiosByStatusSuccessUseCase,
  ) {}

  @Get()
  async handle() {
    const result = await this.fetchAudiosByStatusSuccess.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.map(AudioPresenter.toHTTP)
  }
}
