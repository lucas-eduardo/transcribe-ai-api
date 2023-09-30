import { IUseCaseError } from '@/core/errors/use-case.error'

export class TitleAlreadyExistsError extends Error implements IUseCaseError {
  constructor(title: string) {
    super(`Title "${title}" already exists.`)
  }
}
