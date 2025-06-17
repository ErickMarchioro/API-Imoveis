import { validaJWT, createUnAuthResponse } from './index.js'; 


const authMiddleware = async (req, res, next) => {
    try {
        let token = req.get('Authorization'); 

        if (!token) {
            const response = createUnAuthResponse();
            return res.status(response.code).json(response);
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        const payload = await validaJWT(token);

        req.user = payload; 

        next();
    } catch (error) {
        const response = createUnAuthResponse();
        res.status(response.code).json(response);
    }
};

export default authMiddleware;