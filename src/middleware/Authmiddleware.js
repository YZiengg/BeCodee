const jwt = require('jsonwebtoken');  // Thêm dòng này để import jwt
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) reject(err);
            resolve(user);
        });
    });
}

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(400).json({
            message: 'Token is missing',
            status: 'ERR'
        });
    }

    try {
        const user = await verifyToken(token.split(' ')[1]);
        const { payload } = user;

        if (payload?.admin) {
            return next();
        } else {
            return res.status(403).json({
                message: 'Permission denied',
                status: 'ERR'
            });
        }
    } catch (err) {
        return res.status(401).json({
            message: 'Authentication failedđd',
            status: 'ERR'
        });
    }
}

const authUserMiddleware = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(400).json({
            message: 'Token is missing',
            status: 'ERR'
        });
    }

    const userId = req.params.id;

    try {
        const user = await verifyToken(token.split(' ')[1]);
        const { payload } = user;

        if (user?.admin || user?.id === userId) {
            return next();
        } else {
            return res.status(403).json({
                message: 'Permission denied',
                status: 'ERR'
            });
        }
    } catch (err) {
        return res.status(401).json({
            message: 'Authentication failedê',
            status: 'ERR'
        });
    }
}

module.exports = {
    authMiddleware,
    authUserMiddleware
};
