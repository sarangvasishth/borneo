import { Client as ElasticSearchClient } from "@elastic/elasticsearch"
import { ELASTIC_SEARCH_INDEX, ELASTIC_SEARCH_URL } from "../../config/environment"

export default class ElasticSearchService {
  private esClient: ElasticSearchClient
  private elasticSearchUrl: string
  private elasticSearchIndex: string

  constructor() {
    this.elasticSearchUrl = ELASTIC_SEARCH_URL
    this.elasticSearchIndex = ELASTIC_SEARCH_INDEX
    this.esClient = new ElasticSearchClient({ node: this.elasticSearchUrl })
  }

  public async indexData(documentId: string, data: any): Promise<void> {
    try {
      await this.esClient.index({ index: this.elasticSearchIndex, id: documentId, body: data })
    } catch (error) {
      console.error("Error indexing data to Elasticsearch")
      throw error
    }
  }

  public async searchFiles(query: string) {
    const results = await this.esClient.search({
      index: this.elasticSearchIndex,
      body: {
        query: {
          match: { content: query }
        }
      }
    })

    const reponse = results.hits.hits.map(h => {
      const document = h._source as any
      return {
        title: document.title,
        url: document.url
      }
    })

    return reponse
  }
}
