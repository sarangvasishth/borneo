import multer from "multer"
import { Request, Response, Router } from "express"
import { handleSnsUploadNotification } from "./s3-upload-event.route"
import { handleSearchDocuments } from "./search-documents.route"
import { handleUploadDocument } from "./upload-document.route"
import { asyncRouteWrapper } from "../middleware/async-route-wrapper"

const upload = multer({ storage: multer.memoryStorage() })

export const router = Router()

router.get("/", async (req: Request, res: Response) => {
  res.status(200).send({ success: true })
})

router.post("/upload-file", upload.single("file"), asyncRouteWrapper(handleUploadDocument))

router.post("/s3-upload-event", asyncRouteWrapper(handleSnsUploadNotification))

router.get("/search", asyncRouteWrapper(handleSearchDocuments))
