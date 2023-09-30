import {
  IUploadParams,
  IUploadResponse,
  Uploader,
} from '@/domain/audio/application/storage/uploader'
import { randomUUID } from 'node:crypto'
import { basename } from 'node:path'

interface IUpload {
  fileName: string
}

export class FakeUploader implements Uploader {
  uploads: IUpload[] = []

  async upload({ fileName }: IUploadParams): Promise<IUploadResponse> {
    const extension = '.mp3'

    const fileBaseName = basename(fileName, extension)

    const newFileName = `${fileBaseName}_${randomUUID()}${extension}`

    this.uploads.push({ fileName: newFileName })

    return { name: newFileName }
  }
}
