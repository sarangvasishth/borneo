import axios from "axios"
import { TextExtractionService } from "../../domain/interface"

export class ApacheTikaService implements TextExtractionService {
  constructor(private tikaServerUrl: string) {}

  public async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      const response = await axios.put(`${this.tikaServerUrl}/tika`, fileBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
          Accept: "text/plain"
        },
        maxBodyLength: Infinity // Allow large files
      })

      return response.data
    } catch (error) {
      console.error("Error extracting text with Tika:")
      throw error
    }
  }
}
