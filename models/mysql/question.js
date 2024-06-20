import { connection } from './connection.js';
import { questionMapperFromMySQL } from '../../mappers/from-mysql.js';

export class QuestionModel {

    static async getAll() {
        const [questionsNotMappered] = await connection.query(
            'SELECT * FROM questions'
        );

        if (questionsNotMappered.length === 0) return null;

        const questions = questionsNotMappered.map(question => {
            return questionMapperFromMySQL(question);
        })

        return questions;
    };
}