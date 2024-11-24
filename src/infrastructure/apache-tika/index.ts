import axios from "axios"
import { TextExtractionService } from "../../domain/interface"
import { AWS_S3_MAX_FILE_SIZE } from "../../config/environment"

export class ApacheTikaService implements TextExtractionService {
  constructor(private tikaServerUrl: string) {}

  public async extractText(fileBuffer: Buffer): Promise<string> {
    const response = await axios.put(`${this.tikaServerUrl}/tika`, fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        Accept: "text/plain"
      },
      maxBodyLength: AWS_S3_MAX_FILE_SIZE
    })

    return response.data
  }
}
