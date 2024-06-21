import express from 'express';

import { createTasksRouter } from './routes/tasks.js';
import { createSubTasksRouter } from './routes/sub-tasks.js';
import { createUsersRouter } from './routes/users.js';
import { createQuestionsRouter } from './routes/questions.js';
import { createTasksStatusRouter } from './routes/tasks-status.js'
import { createTasksGroupRouter } from './routes/tasks-group.js';
// import { corsMiddleware } from './middlewares/cors.js';

export const createApp = ({ taskModel, subTaskModel, userModel, questionModel, taskStatusModel, taskGroupModel }) => {
    const app = express();
    app.disable('x-powered-by');
    app.use(express.json());
    // app.use(corsMiddleware());
    app.use((req, res, next) => {
        res.set('Access-Control-Allow-Credentials', 'true');
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    })

    // Api routes

    app.use('/api/tasks', createTasksRouter({ taskModel }));
    app.use('/api/sub-tasks', createSubTasksRouter({ subTaskModel }));
    app.use('/api/users', createUsersRouter({ userModel }));
    app.use('/api/questions', createQuestionsRouter({ questionModel }));
    app.use('/api/tasks-status', createTasksStatusRouter({ taskStatusModel }));
    app.use('/api/tasks-group', createTasksGroupRouter({ taskGroupModel }));

    app.use(function (req, res, next) {
        res.status(404).send("<h1>Sorry nothing found!<h1>");
    });

    const PORT = process.env.PORT ?? 1234;

    app.listen(PORT, () => {
        console.log(`server is running on port http://localhost:${PORT}`);
    });
}
