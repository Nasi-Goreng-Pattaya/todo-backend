import { Request, Response, NextFunction } from "express"
import fs from 'fs'

const convertAvatarToBufferFormat = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.avatar) {
      const maxFileSize = 10 * 1024 * 1024; // 10MB
      if (req.body.avatar.size > maxFileSize) {
        return res.status(400).send('File size exceeds the limit')
      }
        const chunks: Buffer[] = []
        const stream = fs.createReadStream(req.body.avatar)
        stream.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        });
        stream.on('end', () => {
          const imageBuffer = Buffer.concat(chunks)
          req.body.avatar = imageBuffer
          next()
        })
        stream.on('error', (err) => {
          next(err)
        })
      } else
        next()
}

export {
  convertAvatarToBufferFormat
}
