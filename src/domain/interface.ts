import { Readable } from "stream"

export interface Usecase<Request> {
  execute(request: Request): Promise<void>
}

export interface UsecasePresenter<Response> {
  output(response: Response): void
}

export abstract class RoutePresenter<Response> {
  protected response: Response | null = null

  public getResponse(): Response {
    if (this.response === null) {
      throw new Error("Presenter getResponse() called before setting output.")
    }

    return this.response
  }
}

export interface TextExtractionService {
  extractText(fileStream: Readable): Promise<string>
}

export interface DocumentSearchService {
  indexData(documentId: string, data: any): Promise<void>
  searchFiles(queryString: string): Promise<DocumentSearchResult[]>
  generateDocumentId(fileName: string): string
}

export interface CloudStorageService {
  getFileStream(bucketName: string, key: string): Promise<Readable>
}

export interface DocumentSearchResult {
  title: string
  url: string
}

export interface ProcessDocumentInput {
  bucketName: string
  fileName: string
}

export class CustomError extends Error {
  statusCode: number

  constructor(message: string, statusCode?: number) {
    super(message)
    this.statusCode = statusCode ?? 400
  }
}

export type SearchDocumentsPresenter = UsecasePresenter<DocumentSearchResult[]>