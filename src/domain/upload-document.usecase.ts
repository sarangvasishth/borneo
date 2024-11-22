import { CloudStorageService, UploadDocumentInput, Usecase } from "./interface"

export class UploadDocumentsInteractor implements Usecase<UploadDocumentInput> {
  constructor(private cloudStorageService: CloudStorageService) {}

  public async execute(input: UploadDocumentInput) {
    const { contentType } = input

    const supportedContentTypes = ["application/pdf", "text/plain", "application/msword"]
    if (!supportedContentTypes.includes(contentType)) {
      throw new Error(`Unsupported file type: ${contentType}`)
    }

    await this.cloudStorageService.uploadFile(input)
  }
}
