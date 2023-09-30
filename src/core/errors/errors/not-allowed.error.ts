import { IUseCaseError } from '@/core/errors/use-case.error'

export class NotAllowedError extends Error implements IUseCaseError {
  constructor() {
    super('Not allowed')
  }
}
