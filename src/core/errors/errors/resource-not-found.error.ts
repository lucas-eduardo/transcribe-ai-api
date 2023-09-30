import { IUseCaseError } from '@/core/errors/use-case.error'

export class ResourceNotFoundError extends Error implements IUseCaseError {
  constructor() {
    super('Resource not found')
  }
}
