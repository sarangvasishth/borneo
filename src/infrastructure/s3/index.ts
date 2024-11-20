import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import { AWS_REGION, AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY } from "../../config/environment"

export default class S3Service {
  private region: string
  private s3Client: S3Client

  constructor() {
    this.region = AWS_REGION
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: AWS_S3_SECRET_ACCESS_KEY ?? ""
      }
    })
  }

  public async getFileStream(bucketName: string, key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    })

    const response = await this.s3Client.send(command)

    if (!response.Body) {
      throw new Error("No content returned from S3")
    }

    return response.Body as Readable
  }
}
