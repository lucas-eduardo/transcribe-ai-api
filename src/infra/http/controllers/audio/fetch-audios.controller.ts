import { FetchAudiosUseCase } from '@/domain/audio/application/use-cases/fetch-audios.use-case'
import { BadRequestException, Controller, Get } from '@nestjs/common'

import { AudioPresenter } from '../../presenters/audio.presenter'

@Controller('/audios')
export class FetchAudiosController {
  constructor(private fetchAudios: FetchAudiosUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchAudios.execute()

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result.value.map(AudioPresenter.toHTTP)
  }
}
