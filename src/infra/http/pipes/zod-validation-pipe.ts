import {
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
  Paramtype,
} from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

interface IZodValidationPipe {
  schema: ZodSchema
  validationType: Paramtype
}

export class ZodValidationPipe implements PipeTransform {
  constructor(private schemas: IZodValidationPipe[] | ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    let zodSchemas: IZodValidationPipe[]

    if (Array.isArray(this.schemas)) {
      zodSchemas = this.schemas
    } else {
      zodSchemas = [
        {
          schema: this.schemas,
          validationType: metadata.type,
        },
      ]
    }

    const zodSchema = zodSchemas.find(
      (schema) => schema.validationType === metadata.type,
    )

    if (!zodSchema) {
      return value
    }

    try {
      const newValue = zodSchema.schema.parse(value)

      return newValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
