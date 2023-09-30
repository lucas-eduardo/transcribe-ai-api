export interface ITranscriptionParams {
  srt: string
}

export abstract class Transcription {
  abstract generate(params: ITranscriptionParams): Promise<string>
}
