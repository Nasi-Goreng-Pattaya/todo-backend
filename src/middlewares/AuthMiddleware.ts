import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import User from '../models/UserModel'
import { NextFunction, Request, Response } from 'express'

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let bearerToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            bearerToken = req.headers.authorization.split(' ')[1];

            // Verify token and extract user ID from token
            const decoded = <JwtPayload>(jwt.verify(bearerToken, <Secret>process.env.JWT_SECRET))
            const userId = decoded.id;

            // Find user by ID and exclude password property
            const user = await User.findById(userId).select('-password')

            if (!user) {
                next(new Error('User not found'))
                return
            }
                
            // Attach user object to request body, original request body might be empty or contains task object
            req.body = { ...req.body, user }
            next()
        } catch (err) {
            next(err)
            return
        }
    }
    if (!bearerToken) {
        next(new Error('Not authorized, no token found'))
    }
})

export {
    protect
}
