import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import { CloudStorageService } from "../../domain/interface"

export class S3Service implements CloudStorageService {
  constructor(private s3Client: S3Client) {}

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

  public static parseMessageBody(body: string): { bucketName: string; fileName: string } {
    const message = JSON.parse(body)
    const messageJSON = JSON.parse(message.Message)
    return {
      bucketName: messageJSON.Records[0].s3.bucket.name,
      fileName: messageJSON.Records[0].s3.object.key
    }
  }
}
