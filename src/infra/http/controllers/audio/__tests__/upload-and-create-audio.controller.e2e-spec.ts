import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { unlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import request from 'supertest'

function removeFile(fileName: string) {
  const path = resolve(__dirname, `../../../../../../temp/${fileName}`)

  unlinkSync(path)
}

describe('Upload and create audio (E2E)', () => {
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

  describe('[POST] /audios/file', () => {
    beforeEach(async () => {
      await prisma.$executeRaw`DELETE FROM "audios";`
    })

    describe('Successful Scenarios', () => {
      it('should upload and create audio', async () => {
        const response = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/audio.mp3')

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
          audioId: expect.any(String),
        })

        const audio = await prisma.audio.findUnique({
          where: { id: response.body.audioId },
        })

        removeFile(audio!.originalName)
      })
    })

    describe('Error Scenarios', () => {
      it('should return 400 for an invalid file', async () => {
        const response = await request(app.getHttpServer())
          .post('/audios/file')
          .attach('file', './test/e2e/fileInvalid.jpg')

        expect(response.statusCode).toBe(400)
      })
    })
  })
})
