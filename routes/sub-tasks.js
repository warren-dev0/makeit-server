import { Router } from 'express';
import { SubTaskController } from '../controllers/sub-tasks.js';

export const createSubTasksRouter = ({ subTaskModel }) => {

    const subTasksRouter = Router();

    const subTaskController = new SubTaskController({ subTaskModel })

    subTasksRouter.get('/:taskId', subTaskController.getByTask);

    subTasksRouter.post('/:taskId', subTaskController.create);

    subTasksRouter.patch('/:subTaskId', subTaskController.update);

    subTasksRouter.delete('/:subTaskId', subTaskController.delete);

    return subTasksRouter;
}