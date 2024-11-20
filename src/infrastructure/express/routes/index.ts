import axios from "axios"
import crypto from "crypto"
import { Request, Response, Router } from "express"
import { S3_URL } from "../../../config/environment"
import ApacheTikaService from "../../apache-tika"
import ElasticSearchService from "../../elastic-search"
import S3Service from "../../s3"

export const router = Router()

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send({ success: true })
})

router.post("/s3-upload-event", async (req: Request, res: Response) => {
  const messageType = req.header("x-amz-sns-message-type")

  if (messageType === "SubscriptionConfirmation") {
    const message = JSON.parse(req.body)
    const subscribeURL = message.SubscribeURL

    await axios.get(subscribeURL)

    res.status(200).send("Subscription confirmed.")
  } else if (messageType === "Notification") {
    const message = JSON.parse(req.body)
    const messageJSON = JSON.parse(message.Message)

    const bucketName = messageJSON.Records[0].s3.bucket.name
    const fileKey = messageJSON.Records[0].s3.object.key

    const s3Service = new S3Service()
    const fileStream = await s3Service.getFileStream(bucketName, fileKey)

    const extractService = new ApacheTikaService()
    const data = await extractService.extractText(fileStream)

    const uniqueString = `${fileKey}-${Date.now().toString()}`
    const documentId = crypto.createHash("md5").update(uniqueString).digest("hex")

    const dataToIndex = {
      title: fileKey,
      url: `${S3_URL}/${fileKey}`,
      content: data
    }

    const elasticSearch = new ElasticSearchService()
    await elasticSearch.indexData(documentId, dataToIndex)

    res.status(200).send("Notification received.")
  } else {
    res.status(400).send("Unknown message type.")
  }
})

router.get("/search", async (req, res) => {
  const query = req.query.q as string

  const elasticSearch = new ElasticSearchService()

  const response = await elasticSearch.searchFiles(query)

  res.status(200).send({ response })
})
