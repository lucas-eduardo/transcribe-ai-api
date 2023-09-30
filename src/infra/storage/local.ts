import {
  IUploadParams,
  IUploadResponse,
  Uploader,
} from '@/domain/audio/application/storage/uploader'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { extname, basename, resolve } from 'node:path'

@Injectable()
export class LocalStorage implements Uploader {
  async upload({ body, fileName }: IUploadParams): Promise<IUploadResponse> {
    const extension = extname(fileName)

    const fileBaseName = basename(fileName, extension)

    const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`

    const uploadDestination = this.pathDestination(fileUploadName)

    writeFileSync(uploadDestination, body)

    return {
      name: fileUploadName,
    }
  }

  private pathDestination(fileName) {
    return resolve(__dirname, '../../temp', fileName)
  }
}
