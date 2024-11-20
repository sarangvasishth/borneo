import axios from "axios"
import { Readable } from "stream"
import { APACHE_TIKA_URL } from "../../config/environment"

export default class ApacheTikaService {
  private tikaServerUrl: string

  constructor() {
    this.tikaServerUrl = APACHE_TIKA_URL
  }

  public async extractText(fileStream: Readable): Promise<string> {
    try {
      const response = await axios.put(`${this.tikaServerUrl}/tika`, fileStream, {
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
