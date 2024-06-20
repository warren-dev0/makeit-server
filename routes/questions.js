import { Router } from 'express';
import { QuestionController } from '../controllers/questions.js';

export const createQuestionsRouter = ({ questionModel }) => {

    const questionsRouter = Router();

    const questionController = new QuestionController({ questionModel })

    questionsRouter.get('/', questionController.getAll);

    return questionsRouter;
}