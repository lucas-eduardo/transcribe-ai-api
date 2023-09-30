import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PromptFactory } from 'test/factories/make-prompt.factory'

describe('Update prompt (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let promptFactory: PromptFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PromptFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    promptFactory = moduleRef.get(PromptFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[PATCH] /prompts/:promptId', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "prompt_templates";`
    })

    describe('Successful Scenarios', () => {
      it('should update both title and template when provided', async () => {
        const prompt = await promptFactory.makePrismaPrompt()

        const promptId = prompt.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/prompts/${promptId}`)
          .send({
            title: 'Updated title',
            template: 'Updated template',
          })

        expect(response.statusCode).toBe(204)

        const promptOnDatabase = await prisma.promptTemplate.findFirst({
          where: {
            title: 'Updated title',
            template: 'Updated template',
          },
        })

        expect(promptOnDatabase).toBeTruthy()
      })

      it('should update only the title when template is not provided', async () => {
        const prompt = await promptFactory.makePrismaPrompt()

        const promptId = prompt.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/prompts/${promptId}`)
          .send({
            title: 'Updated Title',
          })

        expect(response.statusCode).toBe(204)

        const promptOnDatabase = await prisma.promptTemplate.findUnique({
          where: {
            title: 'Updated Title',
          },
        })

        expect(promptOnDatabase).toBeTruthy()
      })

      it('should update only the template when title is not provided', async () => {
        const prompt = await promptFactory.makePrismaPrompt()

        const promptId = prompt.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/prompts/${promptId}`)
          .send({
            template: 'Updated Template',
          })

        expect(response.statusCode).toBe(204)

        const promptOnDatabase = await prisma.promptTemplate.findFirst({
          where: {
            template: 'Updated Template',
          },
        })

        expect(promptOnDatabase).toBeTruthy()
      })
    })

    describe('Error Scenarios', () => {
      it('should return 400 when attempting to update with an invalid promptId', async () => {
        await promptFactory.makePrismaPrompt()

        const response = await request(app.getHttpServer())
          .patch('/prompts/123')
          .send({
            title: 'Updated title',
            template: 'Updated template',
          })

        expect(response.statusCode).toBe(400)
      })

      it('should return 400 when no updates are provided', async () => {
        const prompt = await promptFactory.makePrismaPrompt()

        const promptId = prompt.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/prompts/${promptId}`)
          .send({})

        expect(response.statusCode).toBe(400)
      })

      it('should return 409 when attempting to update title to an existing title', async () => {
        const prompt = await promptFactory.makePrismaPrompt()
        const { title } = await promptFactory.makePrismaPrompt()

        const promptId = prompt.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/prompts/${promptId}`)
          .send({
            title,
          })

        expect(response.statusCode).toBe(409)
      })
    })
  })
})
