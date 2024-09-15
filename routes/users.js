import { Router } from 'express';
import { UserController } from '../controllers/users.js';

export const createUsersRouter = ({ userModel }) => {

    const userRouter = Router();

    const userController = new UserController({ userModel })

    userRouter.post('/login', userController.login);

    userRouter.get('/:userId', userController.getById);

    userRouter.get('/:userId/questions', userController.getUserQuestions);

    userRouter.get('/username/:username', userController.getByName);

    userRouter.post('/', userController.create);

    userRouter.patch('/:userId', userController.update);

    userRouter.patch('/:userId/forgot', userController.updateForgotPassword);

    userRouter.delete('/:userId', userController.delete);

    return userRouter;
}