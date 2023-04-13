import { Request, Response, NextFunction } from "express"
import bcrypt from 'bcryptjs'

const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password && req.body.password.length >= 8) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      req.body.password = hashedPassword
      next()
    } else {
      next(new Error('The length of the password must at least be 8 characters'))
    }
}

export {
    hashPassword
}
