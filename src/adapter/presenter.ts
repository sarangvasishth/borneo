import { DocumentSearchResult, RoutePresenter, SearchDocumentsPresenter } from "../domain/interface"

export class RouteSearchDocumentsPresenter extends RoutePresenter<DocumentSearchResult[]> implements SearchDocumentsPresenter {
  public output(response: DocumentSearchResult[]): void {
    this.response = response
  }
}
