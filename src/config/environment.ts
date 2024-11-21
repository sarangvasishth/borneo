import dotenv from "dotenv"

dotenv.config()

export const APP_PORT = process.env.APP_PORT || 3001

export const ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || ""
export const ELASTIC_SEARCH_INDEX = process.env.ELASTIC_SEARCH_INDEX || ""
export const ELASTIC_USERNAME = process.env.ELASTIC_USERNAME ?? ""
export const ELASTIC_PASSWORD = process.env.ELASTIC_PASSWORD ?? ""

export const APACHE_TIKA_URL = process.env.APACHE_TIKA_URL || ""

export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || ""
export const AWS_REGION = process.env.AWS_REGION || ""
export const S3_URL = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
export const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID
export const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY
