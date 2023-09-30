import { AudioStatus } from '@/domain/audio/enterprise/entities/audio.entity'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { AudioFactory } from 'test/factories/make-audio.factory'

describe('Update SRT (E2E)', () => {
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

  describe('[PATCH] /audios/:audioId/srt', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('', async () => {
        const audio = await audioFactory.makePrismaAudio({
          status: AudioStatus.success,
          srt: 'SRT',
        })

        const audioId = audio.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/audios/${audioId}/srt`)
          .send({
            srt: 'Updated srt',
          })

        expect(response.statusCode).toBe(204)

        const audioOnDatabase = await prisma.audio.findFirst({
          where: {
            srt: 'Updated srt',
          },
        })

        expect(audioOnDatabase).toBeTruthy()
      })
    })

    describe('Error Scenarios', () => {
      it('', async () => {
        await audioFactory.makePrismaAudio({
          status: AudioStatus.success,
          srt: 'SRT',
        })

        const response = await request(app.getHttpServer())
          .patch(`/audios/${randomUUID()}/srt`)
          .send({
            srt: 'Updated srt',
          })

        expect(response.statusCode).toBe(400)
      })

      it('', async () => {
        const audio = await audioFactory.makePrismaAudio({
          status: AudioStatus.success,
          srt: 'SRT',
        })

        const audioId = audio.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/audios/${audioId}/srt`)
          .send()

        expect(response.statusCode).toBe(400)
      })
    })
  })
})
