import { DocumentSearchService, SearchDocumentsPresenter, Usecase } from "./interface"

export class SearchDocumentsInteractor implements Usecase<string> {
  constructor(private documentSearchService: DocumentSearchService, private presenter: SearchDocumentsPresenter) {}

  public async execute(query: string) {
    const response = await this.documentSearchService.searchFiles(query)
    this.presenter.output(response)
  }
}
