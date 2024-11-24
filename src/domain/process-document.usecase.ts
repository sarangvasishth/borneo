import { AWS_S3_MAX_FILE_SIZE } from "../config/environment"
import { CloudStorageService, DocumentSearchService, ProcessDocumentInput, TextExtractionService, Usecase } from "./interface"

export class ProcessDocumentInteractor implements Usecase<ProcessDocumentInput> {
  constructor(
    private cloudStorageService: CloudStorageService,
    private textExtractionService: TextExtractionService,
    private documentSearchService: DocumentSearchService
  ) {}

  public async execute(input: ProcessDocumentInput) {
    const { fileName, bucketName } = input

    const fileBuffer = await this.cloudStorageService.getFileBuffer(bucketName, fileName)

    if (fileBuffer.length > AWS_S3_MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum allowed size of ${AWS_S3_MAX_FILE_SIZE / (1024 * 1024)} MB for text extraction.`)
    }

    const data = await this.textExtractionService.extractText(fileBuffer)

    const dataToIndex = {
      title: fileName,
      url: this.documentSearchService.generateDocumentUrl(fileName),
      content: data
    }

    const documentId = this.documentSearchService.generateDocumentId(fileName)

    await this.documentSearchService.indexData(documentId, dataToIndex)
  }
}
