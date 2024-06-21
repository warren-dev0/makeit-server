import cors from 'cors';

export const corsMiddleware = ({ acceptedOrigins } = {}) => cors({
    origin: (origin, callback) => {
        
        if (acceptedOrigins.includes(origin)) return callback(null, true);

        if (!origin) return callback(null, true);

        return callback(new Error('The origin is not allowed'));
    }
})

// export const corsMiddleware = () => cors({origin: '*'})