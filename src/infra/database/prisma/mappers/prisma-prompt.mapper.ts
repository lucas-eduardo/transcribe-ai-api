import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'
import { Prisma, PromptTemplate as PrismaPromptTemplate } from '@prisma/client'

export class PrismaPromptMapper {
  static toDomain(raw: PrismaPromptTemplate): PromptEntity {
    return PromptEntity.create(
      {
        template: raw.template,
        title: raw.title,
        enabled: raw.enabled,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    prompt: PromptEntity,
  ): Prisma.PromptTemplateUncheckedCreateInput {
    return {
      id: prompt.id.toString(),
      template: prompt.template,
      title: prompt.title,
      enabled: prompt.enabled,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }
  }
}
