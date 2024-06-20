import { Router } from 'express';
import { TaskStatusController } from '../controllers/tasks-status.js';

export const createTasksStatusRouter = ({ taskStatusModel }) => {

    const tasksStatusRouter = Router();

    const taskStatusController = new TaskStatusController({ taskStatusModel })

    tasksStatusRouter.get('/', taskStatusController.getAll);

    return tasksStatusRouter;
}