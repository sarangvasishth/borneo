import { S3Client } from "@aws-sdk/client-s3"
import { Client as ElasticSearchClient } from "@elastic/elasticsearch"
import axios from "axios"
import { Request, Response } from "express"
import { DocumentProcessingController } from "../../../adapter/controller"
import {
  APACHE_TIKA_URL,
  AWS_REGION,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  ELASTIC_PASSWORD,
  ELASTIC_SEARCH_INDEX,
  ELASTIC_SEARCH_URL,
  ELASTIC_USERNAME
} from "../../../config/environment"
import { ApacheTikaService } from "../../apache-tika"
import { S3Service } from "../../aws/s3-service"
import { ElasticSearchService } from "../../elastic-search"

export const handleSnsUploadNotification = async (req: Request, res: Response) => {
  const messageType = req.header("x-amz-sns-message-type")

  if (messageType === "SubscriptionConfirmation") {
    const message = JSON.parse(req.body)
    const subscribeURL = message.SubscribeURL

    await axios.get(subscribeURL)

    res.status(200).send("Subscription confirmed.")
    return
  }

  if (messageType === "Notification") {
    const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: { accessKeyId: AWS_S3_ACCESS_KEY_ID ?? "", secretAccessKey: AWS_S3_SECRET_ACCESS_KEY ?? "" }
    })

    const s3Service = new S3Service(s3Client)

    const extractService = new ApacheTikaService(APACHE_TIKA_URL)

    const esClient = new ElasticSearchClient({ node: ELASTIC_SEARCH_URL, auth: { username: ELASTIC_USERNAME, password: ELASTIC_PASSWORD } })
    const elasticSearch = new ElasticSearchService(esClient, ELASTIC_SEARCH_INDEX)

    const input = S3Service.parseMessageBody(req.body)

    const controller = new DocumentProcessingController(s3Service, extractService, elasticSearch)
    await controller.processDocument(input)

    res.status(200).send("Notification received.")
    return
  }

  res.status(400).send("Unknown message type.")
}
