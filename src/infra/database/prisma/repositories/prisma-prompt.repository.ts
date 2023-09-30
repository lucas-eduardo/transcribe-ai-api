import { PromptRepository } from '@/domain/prompt/application/repositories/prompt.repository'
import { PromptEntity } from '@/domain/prompt/enterprise/entities/prompt.entity'
import { Injectable } from '@nestjs/common'

import { PrismaPromptMapper } from '../mappers/prisma-prompt.mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaPromptRepository implements PromptRepository {
  constructor(private prismaService: PrismaService) {}

  async find(): Promise<PromptEntity[]> {
    const prompts = await this.prismaService.promptTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return prompts.map(PrismaPromptMapper.toDomain)
  }

  async findById(promptId: string): Promise<PromptEntity | null> {
    const prompt = await this.prismaService.promptTemplate.findUnique({
      where: {
        id: promptId,
      },
    })

    if (!prompt) {
      return null
    }

    return PrismaPromptMapper.toDomain(prompt)
  }

  async findByEnabled(): Promise<PromptEntity[]> {
    const prompts = await this.prismaService.promptTemplate.findMany({
      where: {
        enabled: true,
      },
    })

    return prompts.map(PrismaPromptMapper.toDomain)
  }

  async doesPromptTitleExist(title: string): Promise<boolean> {
    const prompt = await this.prismaService.promptTemplate.findUnique({
      where: {
        title,
      },
    })

    return !!prompt
  }

  async doesPromptTitleExistDiffPromptId(
    title: string,
    promptId: string,
  ): Promise<boolean> {
    const prompt = await this.prismaService.promptTemplate.findUnique({
      where: {
        title,
        NOT: {
          id: promptId,
        },
      },
    })

    return !!prompt
  }

  async create(prompt: PromptEntity): Promise<void> {
    const data = PrismaPromptMapper.toPrisma(prompt)

    await this.prismaService.promptTemplate.create({ data })
  }

  async save(prompt: PromptEntity): Promise<void> {
    const data = PrismaPromptMapper.toPrisma(prompt)

    await this.prismaService.promptTemplate.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
