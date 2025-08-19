import jwt from 'jsonwebtoken'

export const createCookie = (user, res, identifier, ttl = 0) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'Development' ? 'lax' : 'none',
        secure: process.env.NODE_ENV === 'Development' ? false : true
    }

    if (ttl > 0) {
        cookieOptions.maxAge = ttl * 1000 // Convert seconds to milliseconds
    }

    res.status(201).cookie(identifier, token, cookieOptions)
}
