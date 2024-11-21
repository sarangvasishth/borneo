import { Request, Response, Router } from "express"
import { handleSnsUploadNotification } from "./s3-upload-event.route"
import { handleSearchDocuments } from "./search-documents.route"

export const router = Router()

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send({ success: true })
})

router.post("/s3-upload-event", handleSnsUploadNotification)

router.get("/search", handleSearchDocuments)
