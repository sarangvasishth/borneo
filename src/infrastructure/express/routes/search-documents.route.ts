import { Client as ElasticSearchClient } from "@elastic/elasticsearch"
import { Request, Response } from "express"
import { SearchController } from "../../../adapter/controller"
import { RouteSearchDocumentsPresenter } from "../../../adapter/presenter"
import { ELASTIC_PASSWORD, ELASTIC_SEARCH_INDEX, ELASTIC_SEARCH_URL, ELASTIC_USERNAME } from "../../../config/environment"
import { ElasticSearchService } from "../../elastic-search"

export const handleSearchDocuments = async (req: Request, res: Response) => {
  const query = req.query.q as string

  if (!query) {
    return res.status(400).json({ success: false, message: "Query parameter is required." })
  }

  const esClient = new ElasticSearchClient({ node: ELASTIC_SEARCH_URL, auth: { username: ELASTIC_USERNAME, password: ELASTIC_PASSWORD } })

  const indexExists = await esClient.indices.exists({ index: ELASTIC_SEARCH_INDEX })
  if (!indexExists) {
    return res.status(404).json({
      success: false,
      message: `Index ${ELASTIC_SEARCH_INDEX} not found. Please ensure the index exists.`
    })
  }

  const elasticSearch = new ElasticSearchService(esClient, ELASTIC_SEARCH_INDEX)

  const presenter = new RouteSearchDocumentsPresenter()

  const controller = new SearchController(elasticSearch)
  await controller.searchDocuments(query, presenter)

  const response = await elasticSearch.searchFiles(query)
  res.status(200).send({ response })
}
