import { Router } from 'express';
import { TaskController } from '../controllers/tasks.js';

export const createTasksRouter = ({ taskModel }) => {

    const tasksRouter = Router();

    const taskController = new TaskController({ taskModel })

    tasksRouter.get('/', taskController.getById);

    tasksRouter.get('/:userId', taskController.getByUser);

    tasksRouter.post('/', taskController.create);

    tasksRouter.patch('/:taskId', taskController.update);

    tasksRouter.delete('/:taskId', taskController.delete);

    return tasksRouter;
}