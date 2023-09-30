import { InMemoryAudioRepository } from 'test/repositories/in-memory-audio.repository'
import { FakeUploader } from 'test/storage/fake-uploader'

import { InvalidAudioTypeError } from '../errors/invalid-file-type-error'
import { UploadAndCreateAudioUseCase } from '../upload-and-create-audio.use-case'

let inMemoryAudioRepository: InMemoryAudioRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateAudioUseCase

describe('Upload and create audio', () => {
  beforeEach(() => {
    inMemoryAudioRepository = new InMemoryAudioRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAudioUseCase(inMemoryAudioRepository, fakeUploader)
  })

  it('should successfully upload and create an audio file with valid parameters', async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      fileName: 'audio.mp3',
      fileType: 'audio/mp3',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual(
      expect.objectContaining({
        originalName: inMemoryAudioRepository.audios[0].originalName,
      }),
    )
  })

  it('should return an error for an invalid audio file type', async () => {
    const result = await sut.execute({
      body: Buffer.from(''),
      fileName: 'audio.mp3',
      fileType: 'audio/mp4',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAudioTypeError)
  })
})
