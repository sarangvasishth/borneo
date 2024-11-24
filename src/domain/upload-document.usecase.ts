import { AWS_S3_MAX_FILE_SIZE } from "../config/environment"
import { CloudStorageService, UploadDocumentInput, Usecase } from "./interface"

export class UploadDocumentsInteractor implements Usecase<UploadDocumentInput> {
  constructor(private cloudStorageService: CloudStorageService) {}

  public async execute(input: UploadDocumentInput) {
    const { contentType, fileBuffer } = input

    if (fileBuffer.length > AWS_S3_MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum allowed size of ${AWS_S3_MAX_FILE_SIZE / (1024 * 1024)} MB`)
    }

    const supportedContentTypes = ["application/pdf", "text/plain", "application/msword"]
    if (!supportedContentTypes.includes(contentType)) {
      throw new Error(`Unsupported file type: ${contentType}`)
    }

    await this.cloudStorageService.uploadFile(input)
  }
}
