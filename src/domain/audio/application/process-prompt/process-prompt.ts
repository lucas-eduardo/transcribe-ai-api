export interface IProcessPromptParams {
  prompt: string
  transcription: string
  temperature: number
}

export abstract class ProcessPrompt {
  abstract process(params: IProcessPromptParams): Promise<ReadableStream>
}
