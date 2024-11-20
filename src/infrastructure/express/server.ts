import http from "http"
import { APP_PORT } from "../../config/environment"
import { app } from "./app"

const server = http.createServer(app)

const startServer = async () => {
  try {
    server.listen(APP_PORT, () => {
      console.log(`Server is running on port ${APP_PORT}`)
    })
  } catch (err) {
    console.error("Unable to connect to the database:", err)
    process.exit(1)
  }
}

startServer()

const shutdown = () => {
  console.log("Received shutdown signal, closing HTTP server...")
  server.close(err => {
    if (err) {
      console.error("Error closing the server:", err)
      process.exit(1)
    }
  })
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})

process.on("uncaughtException", err => {
  console.error("Uncaught Exception thrown:", err)
  process.exit(1)
})
