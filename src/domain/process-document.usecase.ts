import { CloudStorageService, DocumentSearchService, ProcessDocumentInput, TextExtractionService, Usecase } from "./interface"

export class ProcessDocumentInteractor implements Usecase<ProcessDocumentInput> {
  constructor(
    private cloudStorageService: CloudStorageService,
    private textExtractionService: TextExtractionService,
    private documentSearchService: DocumentSearchService
  ) {}

  public async execute(input: ProcessDocumentInput) {
    const { fileName, bucketName } = input

    const fileStream = await this.cloudStorageService.getFileStream(bucketName, fileName)

    const data = await this.textExtractionService.extractText(fileStream)

    const dataToIndex = {
      title: fileName,
      url: this.documentSearchService.generateDocumentUrl(fileName),
      content: data
    }

    const documentId = this.documentSearchService.generateDocumentId(fileName)

    await this.documentSearchService.indexData(documentId, dataToIndex)
  }
}
