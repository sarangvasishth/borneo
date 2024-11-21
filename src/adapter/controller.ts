import { CloudStorageService, DocumentSearchService, ProcessDocumentInput, SearchDocumentsPresenter, TextExtractionService } from "../domain/interface"
import { ProcessDocumentInteractor } from "../domain/process-document.usecase"
import { SearchDocumentsInteractor } from "../domain/search-documents.usecase"

export class DocumentProcessingController {
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

export class DocumentSearchController {
  constructor(private documentSearchService: DocumentSearchService) {}

  public async searchDocuments(query: string, presenter: SearchDocumentsPresenter) {
    const usecase = new SearchDocumentsInteractor(this.documentSearchService, presenter)
    await usecase.execute(query)
  }
}
