import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AudioFactory } from 'test/factories/make-audio.factory'

describe('Fetch audios (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let audioFactory: AudioFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AudioFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    audioFactory = moduleRef.get(AudioFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[GET] /audios', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('should return an empty array when there are no audios', async () => {
        const response = await request(app.getHttpServer())
          .get('/audios')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(0)
      })

      it('should return an array of audios', async () => {
        await Promise.all([
          audioFactory.makePrismaAudio({
            name: 'Audio One',
            srt: 'srt one',
            transcription: 'transcription one',
          }),
          audioFactory.makePrismaAudio({
            name: 'Audio Two',
            srt: 'srt two',
            transcription: 'transcription two',
          }),
        ])

        const response = await request(app.getHttpServer())
          .get('/audios')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(2)
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: 'Audio One',
              srt: 'srt one',
              transcription: 'transcription one',
            }),
            expect.objectContaining({ title: 'Audio Two' }),
          ]),
        )
      })
    })
  })
})
