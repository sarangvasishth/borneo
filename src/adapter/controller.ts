import {
  CloudStorageService,
  DocumentSearchService,
  ProcessDocumentInput,
  SearchDocumentsPresenter,
  TextExtractionService,
  UploadDocumentInput
} from "../domain/interface"
import { ProcessDocumentInteractor } from "../domain/process-document.usecase"
import { SearchDocumentsInteractor } from "../domain/search-documents.usecase"
import { UploadDocumentsInteractor } from "../domain/upload-document.usecase"

export class CloudStorageController {
  constructor(private cloudStorageService: CloudStorageService) {}

  public async uploadDocument(input: UploadDocumentInput) {
    const usecase = new UploadDocumentsInteractor(this.cloudStorageService)
    await usecase.execute(input)
  }
}

export class ProcessingController {
  constructor(
    private cloudStorageService: CloudStorageService,
    private textExtractionService: TextExtractionService,
    private documentSearchService: DocumentSearchService
  ) {}

  public async processDocument(input: ProcessDocumentInput) {
    const usecase = new ProcessDocumentInteractor(this.cloudStorageService, this.textExtractionService, this.documentSearchService)
    await usecase.execute(input)
  }
}

export class SearchController {
  constructor(private documentSearchService: DocumentSearchService) {}

  public async searchDocuments(query: string, presenter: SearchDocumentsPresenter) {
    const usecase = new SearchDocumentsInteractor(this.documentSearchService, presenter)
    await usecase.execute(query)
  }
}
