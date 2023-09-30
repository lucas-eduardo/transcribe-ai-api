import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PromptFactory } from 'test/factories/make-prompt.factory'

describe('Fetch prompts by enabled (E2E)', () => {
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

  describe('[GET] /prompts/enabled', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "prompt_templates";`
    })

    describe('Successful Scenarios', () => {
      it('should return an empty array when there are no enabled prompts', async () => {
        const response = await request(app.getHttpServer())
          .get('/prompts/enabled')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(0)
      })

      it('should return an array of enabled prompts when there are enabled prompts in the database', async () => {
        await Promise.all([
          promptFactory.makePrismaPrompt({
            title: 'Prompt One',
            enabled: false,
          }),
          promptFactory.makePrismaPrompt({ title: 'Prompt Two' }),
          promptFactory.makePrismaPrompt({ title: 'Prompt Three' }),
        ])

        const response = await request(app.getHttpServer())
          .get('/prompts/enabled')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(2)
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: 'Prompt Two' }),
            expect.objectContaining({ title: 'Prompt Three' }),
          ]),
        )
      })
    })
  })
})
