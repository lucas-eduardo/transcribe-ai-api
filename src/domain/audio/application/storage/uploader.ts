export interface IUploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface IUploadResponse {
  name: string
}

export abstract class Uploader {
  abstract upload(params: IUploadParams): Promise<IUploadResponse>
}
