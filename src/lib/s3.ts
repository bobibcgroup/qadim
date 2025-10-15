import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME!

export async function uploadDocument(key: string, content: string, metadata?: Record<string, string>) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: content,
      ContentType: 'text/plain',
      Metadata: metadata,
    })
    
    await s3Client.send(command)
    return { success: true, key }
  } catch (error) {
    console.error('S3 upload error:', error)
    throw error
  }
}

export async function downloadDocument(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    const response = await s3Client.send(command)
    const content = await response.Body?.transformToString()
    
    if (!content) {
      throw new Error('No content received from S3')
    }
    
    return content
  } catch (error) {
    console.error('S3 download error:', error)
    throw error
  }
}

export async function deleteDocument(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    
    await s3Client.send(command)
    return { success: true }
  } catch (error) {
    console.error('S3 delete error:', error)
    throw error
  }
}

export function getDocumentUrl(key: string): string {
  return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`
}
