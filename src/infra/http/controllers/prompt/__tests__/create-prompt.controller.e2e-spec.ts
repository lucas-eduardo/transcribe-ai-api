import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PromptFactory } from 'test/factories/make-prompt.factory'

describe('Create prompt (E2E)', () => {
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

  describe('[POST] /prompts', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "prompt_templates";`
    })

    describe('Successful Scenarios', () => {
      it('should create a new prompt', async () => {
        const response = await request(app.getHttpServer())
          .post('/prompts')
          .send({
            title: 'Title prompt',
            template: 'Template prompt',
          })

        expect(response.statusCode).toBe(201)

        const promptOnDatabase = await prisma.promptTemplate.findUnique({
          where: {
            title: 'Title prompt',
          },
        })

        expect(promptOnDatabase).toBeTruthy()
      })
    })

    describe('Error Scenarios', () => {
      it('should return 409 when attempting to update title to an existing title', async () => {
        const prompt = await promptFactory.makePrismaPrompt()

        const response = await request(app.getHttpServer())
          .post('/prompts')
          .send({
            title: prompt.title,
            template: 'Template prompt',
          })

        expect(response.statusCode).toBe(409)
      })
    })
  })
})
