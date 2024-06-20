import { connection } from './connection.js';
import { taskStatusMapperFromMySQL } from '../../mappers/from-mysql.js';

export class TaskStatusModel {

    static async getAll() {
        const [taskStatusNotMappered] = await connection.query(
            'SELECT * FROM task_status'
        );

        if (taskStatusNotMappered.length === 0) return null;

        const tasksStatus = taskStatusNotMappered.map(taskStatus => {
            return taskStatusMapperFromMySQL(taskStatus);
        })

        return tasksStatus;
    };
}