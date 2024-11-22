import { Client as ElasticSearchClient } from "@elastic/elasticsearch"
import crypto from "crypto"
import { DocumentSearchResult, DocumentSearchService } from "../../domain/interface"

export class ElasticSearchService implements DocumentSearchService {
  constructor(private esClient: ElasticSearchClient, private elasticSearchIndex: string) {}

  public async indexData(documentId: string, data: any): Promise<void> {
    await this.esClient.index({ index: this.elasticSearchIndex, id: documentId, body: data })
  }

  public async searchFiles(queryString: string): Promise<DocumentSearchResult[]> {
    const results = await this.esClient.search({
      index: this.elasticSearchIndex,
      body: {
        query: {
          match: { content: queryString }
        }
      }
    })

    const reponse: DocumentSearchResult[] = results.hits.hits.map(h => {
      const document = h._source as any
      return {
        title: document.title as string,
        url: document.url as string
      }
    })

    return reponse
  }

  public generateDocumentId(fileName: string): string {
    const uniqueString = `${fileName}-${Date.now().toString()}`
    return crypto.createHash("md5").update(uniqueString).digest("hex")
  }

  public generateDocumentUrl(fileName: string): string {
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
  }
}
