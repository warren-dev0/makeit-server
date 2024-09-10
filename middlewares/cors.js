import cors from 'cors';

export const corsMiddleware = () => {
    return cors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE',
        allowedHeaders: 'Content-Type,Authorization',
    });
}