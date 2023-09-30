import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

describe('Execute prompt by audio (E2E)', () => {
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

  describe('[POST] audios/:audioId/execute-prompt', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('should execute prompt successfully and return the expected result', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
            prompt: 'Contagem, regressiva',
          })

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/execute-prompt`)
          .send({
            prompt: `Abaixo você receberá uma transcrição, use essa transcrição para somar os números.
            Transcrição:
            '''
            {transcription}
            '''
            `,
            temperature: 0,
          })

        expect(response.statusCode).toBe(200)

        expect(response.text).toContain('55')
      })
    })

    describe('Error Scenarios', () => {
      it('should return 400 when prompt data is incomplete', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
            prompt: 'Contagem, regressiva',
          })

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/execute-prompt`)
          .send({
            prompt: `Abaixo você receberá uma transcrição, use essa transcrição para somar os números.
            Transcrição:
            '''
            {transcription}
            '''
            `,
          })

        expect(response.statusCode).toBe(400)
      })

      it('should return 400 when temperature is not provided', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
            prompt: 'Contagem, regressiva',
          })

        const response = await request(app.getHttpServer())
          .post(`/audios/${audioId}/execute-prompt`)
          .send({
            temperature: 0,
          })

        expect(response.statusCode).toBe(400)
      })

      it('should return 400 when audioId is not found', async () => {
        const uploadAudio = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        const audioId = uploadAudio.body.audioId

        await request(app.getHttpServer())
          .post(`/audios/${audioId}/str-transcription`)
          .send({
            name: 'Test generate srt and transcription',
            prompt: 'Contagem, regressiva',
          })

        const response = await request(app.getHttpServer())
          .post(`/audios/${randomUUID()}/execute-prompt`)
          .send({
            prompt: `Abaixo você receberá uma transcrição, use essa transcrição para somar os números.
            Transcrição:
            '''
            {transcription}
            '''
            `,
            temperature: 0,
          })

        expect(response.statusCode).toBe(400)
      })
    })
  })
})
