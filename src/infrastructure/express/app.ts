import bodyParser from "body-parser"
import express from "express"
import { router } from "./routes"

export const app = express()

app.use(express.json())
app.use(bodyParser.text({ type: "text/plain" }))

app.use(router)
