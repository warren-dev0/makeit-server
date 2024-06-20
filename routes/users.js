import { Router } from 'express';
import { UserController } from '../controllers/users.js';

export const createUsersRouter = ({ userModel }) => {

    const userRouter = Router();

    const userController = new UserController({ userModel })

    userRouter.post('/login', userController.login);

    userRouter.get('/:userId', userController.getById);

    userRouter.post('/', userController.create);

    userRouter.patch('/:userId', userController.update);

    userRouter.delete('/:userId', userController.delete);

    return userRouter;
}