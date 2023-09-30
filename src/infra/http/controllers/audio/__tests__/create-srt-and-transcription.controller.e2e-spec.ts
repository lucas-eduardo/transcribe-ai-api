import { AudioStatus } from '@/domain/audio/enterprise/entities/audio.entity'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'node:crypto'
import { unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import request from 'supertest'

function removeFile(fileName: string) {
  const path = resolve(__dirname, `../../../../../../temp/${fileName}`)

  unlinkSync(path)
}

describe('Create SRT and transcription to audio (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('[POST] /audios/:audioId/str-transcription', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('should create a new srt and transcription', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
            prompt: 'Contagem, regressiva',
          })

        expect(response.statusCode).toBe(201)

        const audio = await prisma.audio.findUnique({
          where: { id: audioId },
        })

        expect(audio?.name).toBe('Test generate srt and transcription')
        expect(audio?.status).toBe(AudioStatus.success)
        expect(audio?.srt).toBeTypeOf('string')
        expect(audio?.transcription).toBeTypeOf('string')
        expect(audio?.transcription).toContain('10, 9, 8, 7, 6, 5, 4, 3, 2, 1')
      })
    })

    describe('Error Scenarios', () => {
      it('should return 400 when missing name', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
          })

        expect(response.statusCode).toBe(400)

        const audio = await prisma.audio.findUnique({
          where: { id: audioId },
        })

        removeFile(audio!.originalName)
      })

      it('should return 400 when missing prompt', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            prompt: 'Contagem regressiva',
          })

        expect(response.statusCode).toBe(400)

        const audio = await prisma.audio.findUnique({
          where: { id: audioId },
        })

        removeFile(audio!.originalName)
      })

      it('should return 400 when missing name and prompt', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send()

        expect(response.statusCode).toBe(400)

        const audio = await prisma.audio.findUnique({
          where: { id: audioId },
        })

        removeFile(audio!.originalName)
      })

      it('should return 400 when invalid audioId', async () => {
        const response = await request(app.getHttpServer())
          .post(`/audios/${randomUUID()}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
            prompt: 'Contagem regressiva',
          })

        expect(response.statusCode).toBe(400)
      })
    })
  })
})
