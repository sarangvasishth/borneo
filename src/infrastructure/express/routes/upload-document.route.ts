import { S3Client } from "@aws-sdk/client-s3"
import { Request, Response } from "express"
import { CloudStorageController } from "../../../adapter/controller"
import { AWS_REGION, AWS_S3_ACCESS_KEY_ID, AWS_S3_BUCKET_NAME, AWS_S3_SECRET_ACCESS_KEY } from "../../../config/environment"
import { UploadDocumentInput } from "../../../domain/interface"
import { S3Service } from "../../aws/s3-service"

export const handleUploadDocument = async (req: Request, res: Response) => {
  const file = req.file

  if (!file) {
    res.status(400).send("No file uploaded.")
    return
  }

  const contentType = file.mimetype
  const { key } = req.body

  if (!key) {
    res.status(400).send("Missing key or bucketName in request body.")
    return
  }

  const input: UploadDocumentInput = {
    key,
    bucketName: AWS_S3_BUCKET_NAME,
    fileBuffer: file.buffer,
    contentType
  }

  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: AWS_S3_SECRET_ACCESS_KEY ?? ""
    }
  })

  const s3Service = new S3Service(s3Client)
  const controller = new CloudStorageController(s3Service)

  await controller.uploadDocument(input)

  res.status(200).send({ success: true })
}
