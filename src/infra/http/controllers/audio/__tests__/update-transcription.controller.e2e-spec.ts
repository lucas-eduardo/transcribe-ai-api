import { AudioStatus } from '@/domain/audio/enterprise/entities/audio.entity'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { AudioFactory } from 'test/factories/make-audio.factory'

describe('Update transcription (E2E)', () => {
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

  describe('[PATCH] /audios/:audioId/transcription', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('should update transcription successfully', async () => {
        const audio = await audioFactory.makePrismaAudio({
          status: AudioStatus.success,
          transcription: 'Transcription',
        })

        const audioId = audio.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/audios/${audioId}/transcription`)
          .send({
            transcription: 'Updated transcription',
          })

        expect(response.statusCode).toBe(204)

        const audioOnDatabase = await prisma.audio.findFirst({
          where: {
            transcription: 'Updated transcription',
          },
        })

        expect(audioOnDatabase).toBeTruthy()
      })
    })

    describe('Error Scenarios', () => {
      it('should return 400 for invalid audioId', async () => {
        await audioFactory.makePrismaAudio({
          status: AudioStatus.success,
          transcription: 'Transcription',
        })

        const response = await request(app.getHttpServer())
          .patch(`/audios/${randomUUID()}/transcription`)
          .send({
            transcription: 'Updated transcription',
          })

        expect(response.statusCode).toBe(400)
      })

      it('should return 400 for missing transcription in the request', async () => {
        const audio = await audioFactory.makePrismaAudio({
          status: AudioStatus.success,
          transcription: 'Transcription',
        })

        const audioId = audio.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/audios/${audioId}/transcription`)
          .send()

        expect(response.statusCode).toBe(400)
      })
    })
  })
})
