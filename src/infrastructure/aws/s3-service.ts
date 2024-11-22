import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import { CloudStorageService, UploadDocumentInput } from "../../domain/interface"

export class S3Service implements CloudStorageService {
  constructor(private s3Client: S3Client) {}

  public async getFileBuffer(bucketName: string, key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    })

    const response = await this.s3Client.send(command)

    if (!response.Body) {
      throw new Error("No content returned from S3")
    }

    const chunks: Buffer[] = []
    for await (const chunk of response.Body as Readable) {
      chunks.push(Buffer.from(chunk))
    }

    return Buffer.concat(chunks) // Combine chunks into a single buffer
  }

  public async uploadFile(input: UploadDocumentInput): Promise<void> {
    const { bucketName, key, fileBuffer, contentType } = input

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType
    })

    await this.s3Client.send(command)
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
