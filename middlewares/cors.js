import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:5173',
    'https://x59qt5dp-5173.use2.devtunnels.ms/'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
        
        if (acceptedOrigins.includes(origin)) return callback(null, true);

        if (!origin) return callback(null, true);

        return callback(new Error('The origin is not allowed'));
    }
})

// export const corsMiddleware = () => cors({origin: '*'})