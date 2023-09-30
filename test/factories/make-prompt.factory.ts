import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  IPromptProps,
  PromptEntity,
} from '@/domain/prompt/enterprise/entities/prompt.entity'
import { PrismaPromptMapper } from '@/infra/database/prisma/mappers/prisma-prompt.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makePrompt(
  override: Partial<IPromptProps> = {},
  id?: UniqueEntityID,
) {
  const prompt = PromptEntity.create(
    {
      enabled: true,
      title: faker.lorem.sentence(2),
      template: faker.lorem.paragraph(),
      ...override,
    },
    id,
  )

  return prompt
}

@Injectable()
export class PromptFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPrompt(
    data: Partial<IPromptProps> = {},
  ): Promise<PromptEntity> {
    const prompt = makePrompt(data)

    await this.prisma.promptTemplate.create({
      data: PrismaPromptMapper.toPrisma(prompt),
    })

    return prompt
  }
}
