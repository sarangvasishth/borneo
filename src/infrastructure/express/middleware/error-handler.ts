import { Request, Response, NextFunction } from "express"
import { CustomError } from "../../../domain/interface"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("ErrorHandler Error:", err)

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ success: false, message: err.message })
    return
  }

  res.status(500).json({ success: false, message: "Internal Server Error" })
}
