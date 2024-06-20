export class QuestionController {

    constructor({ questionModel }) {
        this.questionModel = questionModel;
    }

    getAll = async (req, res) => {
        const questions = await this.questionModel.getAll();
        if (questions) return res.json(questions);
        res.status(404).json({ message: 'Questions not found' });
    };
}