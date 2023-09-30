export interface ISrtParams {
  fileName: string
  prompt: string
}

export abstract class Srt {
  abstract generate(params: ISrtParams): Promise<string>
}
