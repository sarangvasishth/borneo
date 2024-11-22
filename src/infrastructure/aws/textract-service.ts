import { DetectDocumentTextCommand, TextractClient } from "@aws-sdk/client-textract"
import { Readable } from "stream"
import { TextExtractionService } from "../../domain/interface"

export class AWSTextractService implements TextExtractionService {
  private client: TextractClient

  constructor(region: string) {
    this.client = new TextractClient({ region })
  }

  public async extractText(fileStream: Readable): Promise<string> {
    try {
      const buffer = await this.streamToBuffer(fileStream)

      const command = new DetectDocumentTextCommand({
        Document: {
          Bytes: buffer // Convert file stream to buffer
        }
      })

      const response = await this.client.send(command)
      const text = response.Blocks?.filter(block => block.BlockType === "LINE")
        .map(block => block.Text)
        .join("\n")

      return text || ""
    } catch (error) {
      console.error("Error extracting text with Textract:", error)
      throw error
    }
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }
}
