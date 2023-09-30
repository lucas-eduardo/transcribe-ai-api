import { InvalidAudioTypeError } from '@/domain/audio/application/use-cases/errors/invalid-file-type-error'
import { UploadAndCreateAudioUseCase } from '@/domain/audio/application/use-cases/upload-and-create-audio.use-case'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/audios/file')
export class UploadAndCreateAudioController {
  constructor(private uploadAndCreateAudio: UploadAndCreateAudioUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 4 * 1024 * 1024 * 1024, // 4GB
          }),
          new FileTypeValidator({
            fileType: '.(mp3|mpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAudio.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAudioTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    return {
      audioId: result.value.id.toString(),
    }
  }
}
