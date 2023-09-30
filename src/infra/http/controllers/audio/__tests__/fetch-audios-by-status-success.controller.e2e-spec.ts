import { AudioStatus } from '@/domain/audio/enterprise/entities/audio.entity'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AudioFactory } from 'test/factories/make-audio.factory'

describe('Fetch audios by status success (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let audioFactory: AudioFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AudioFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    audioFactory = moduleRef.get(AudioFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[GET] /audios/success', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('should return an empty array when there are no successful audios', async () => {
        const response = await request(app.getHttpServer())
          .get('/audios/success')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(0)
      })

      it('should return an array of successful audios', async () => {
        await Promise.all([
          audioFactory.makePrismaAudio({
            name: 'Audio One',
            status: AudioStatus.failed,
          }),
          audioFactory.makePrismaAudio({
            name: 'Audio Two',
            status: AudioStatus.pending,
          }),
          audioFactory.makePrismaAudio({
            name: 'Audio Three',
            status: AudioStatus.processing,
          }),
          audioFactory.makePrismaAudio({
            name: 'Audio For',
            status: AudioStatus.success,
          }),
        ])

        const response = await request(app.getHttpServer())
          .get('/audios/success')
          .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: 'Audio For' }),
          ]),
        )
      })
    })
  })
})
