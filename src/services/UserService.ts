import User from '../models/UserModel'
import bcrypt from 'bcryptjs'
import jwt, { Secret } from 'jsonwebtoken'

const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email })
 
    if (user && (await bcrypt.compare(password, user.password))) {
        return {
            _id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            birthDate: user.birthDate,
            avatar: user.avatar,
            token: generateToken(user.id)   
        }
    } else {
        throw new Error('Invalid credentials')
    }
}

const registerUser = async (userBody: Object) => {
    const user = await User.create(userBody)
    const token = generateToken(user.id)
    
    return {
        _id: user.id,
        name: user.name,
        email: user.email,
        token
    }
}

const updateUser = (id: string, newInfoBody: Object) => {
    return User.findByIdAndUpdate(id, newInfoBody, { new: true }).select('-password')
}

const deleteUser = (id: string) => {
    return User.findByIdAndRemove(id).select('-password')
}

// Generate JWT Token
const generateToken = (id: string) => {
    return jwt.sign({id}, <Secret>process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}

export {
    loginUser,
    registerUser,
    updateUser,
    deleteUser
}