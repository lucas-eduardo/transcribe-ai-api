import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PromptFactory } from 'test/factories/make-prompt.factory'

describe('Fetch prompts (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let promptFactory: PromptFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PromptFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    promptFactory = moduleRef.get(PromptFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[GET] /prompts', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "prompt_templates";`
    })

    describe('Successful Scenarios', () => {
      it('should return an empty array when there are no prompts', async () => {
        const response = await request(app.getHttpServer())
          .get('/prompts')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(0)
      })

      it('should return an array of prompts when there are prompts in the database', async () => {
        await Promise.all([
          promptFactory.makePrismaPrompt({ title: 'Prompt One' }),
          promptFactory.makePrismaPrompt({ title: 'Prompt Two' }),
        ])

        const response = await request(app.getHttpServer())
          .get('/prompts')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(2)
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: 'Prompt One' }),
            expect.objectContaining({ title: 'Prompt Two' }),
          ]),
        )
      })
    })
  })
})
