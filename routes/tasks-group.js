import { Router } from 'express';
import { TaskGroupController } from '../controllers/tasks-group.js';

export const createTasksGroupRouter = ({ taskGroupModel }) => {

    const tasksGroupRouter = Router();

    const taskGroupController = new TaskGroupController({ taskGroupModel })

    tasksGroupRouter.get('/:userId', taskGroupController.getByUser);
    tasksGroupRouter.get('/id/:groupId', taskGroupController.getById);
    tasksGroupRouter.post('/', taskGroupController.create);
    tasksGroupRouter.patch('/:groupId', taskGroupController.update);
    tasksGroupRouter.delete('/:groupId', taskGroupController.delete);

    return tasksGroupRouter;
}