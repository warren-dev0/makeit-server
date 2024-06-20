import { connection } from './connection.js';
import { subTaskMapperToMySQL } from '../../mappers/to-mysql.js';
import { subTaskMapperFromMySQL } from '../../mappers/from-mysql.js';

export class SubTaskModel {

    static async getByTask({ taskId }) {
        const [subTasksNotMappered] = await connection.query(
            'SELECT BIN_TO_UUID(sub_task_id) sub_task_id, sub_task_title, status_id, BIN_TO_UUID(task_id) task_id FROM sub_tasks WHERE BIN_TO_UUID(task_id) = ?;', [taskId]
        );

        if (subTasksNotMappered.length === 0) return null;

        const subTasks = subTasksNotMappered.map(subTask => {
            return subTaskMapperFromMySQL(subTask);
        })

        return subTasks;
    };

    static async create({ taskId, input }) {
        const {
            title,
        } = input;

        const [task] = await connection.query(
            'SELECT BIN_TO_UUID(task_id) task_id FROM tasks WHERE BIN_TO_UUID(task_id) = ?;', [taskId]
        );

        if (task.length === 0) return null;

        const [subTaskUuid] = await connection.query('SELECT UUID() uuid;');
        const [{ uuid }] = subTaskUuid;

        const statusId = 1;

        const newSubTask = subTaskMapperToMySQL({ title, statusId });

        Object.keys(newSubTask).forEach((key) => {
            if (newSubTask[key] === undefined || newSubTask[key] === null || newSubTask[key] === '') delete newSubTask[key];
        });

        try {
            await connection.query(
                `INSERT INTO sub_tasks (sub_task_id, sub_task_title, status_id, task_id) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?));`, [uuid, newSubTask.sub_task_title, newSubTask.status_id, taskId]
            );
        } catch (e) {
            throw new Error('Error creating sub task');
        }

        let [createdSubTask] = await connection.query(
            'SELECT BIN_TO_UUID(sub_task_id) sub_task_id, sub_task_title, status_id, BIN_TO_UUID(task_id) task_id FROM sub_tasks WHERE BIN_TO_UUID(sub_task_id) = ?;', [uuid]
        );

        createdSubTask = subTaskMapperFromMySQL(createdSubTask[0]);

        return createdSubTask;

    };

    static async update({ subTaskId, input }) {
        const {
            title,
            statusId
        } = input;

        const [subTask] = await connection.query(
            'SELECT * FROM sub_tasks WHERE BIN_TO_UUID(sub_task_id) = ?;', [subTaskId]
        );

        if (subTask.length === 0) return null;

        const valuesToUpdate = subTaskMapperToMySQL({ title, statusId });

        Object.keys(valuesToUpdate).forEach((key) => {
            if(valuesToUpdate[key] === undefined || valuesToUpdate[key] === null || valuesToUpdate[key] === '') delete valuesToUpdate[key];
        });

        const keys = Object.keys(valuesToUpdate);
        const values = Object.values(valuesToUpdate);

        const updateQuery = keys.map((key) => `${key} = ?`).join(', ');

        try {
            await connection.query(
                `UPDATE sub_tasks SET ${updateQuery} WHERE BIN_TO_UUID(sub_task_id) = ?;`, [...values, subTaskId]
            );
        } catch (e) {
            throw new Error('Error updating sub task');
        }

        let [updatedSubTask] = await connection.query(
            'SELECT BIN_TO_UUID(sub_task_id) sub_task_id, sub_task_title, status_id, BIN_TO_UUID(task_id) task_id FROM sub_tasks WHERE BIN_TO_UUID(sub_task_id) = ?;', [subTaskId]
        );

        updatedSubTask = subTaskMapperFromMySQL(updatedSubTask[0]);

        Object.keys(updatedSubTask).forEach((key) => {
            if (updatedSubTask[key] === undefined || updatedSubTask[key] === null || updatedSubTask[key] === '') delete updatedSubTask[key];
        });

        return updatedSubTask;

    };

    static async delete({ subTaskId }) {

        const [subTask] = await connection.query(
            'SELECT * FROM sub_tasks WHERE BIN_TO_UUID(sub_task_id) = ?;', [subTaskId]
        );

        if (subTask.length === 0) return null;

        try {
            const [subTaskDeleted] = await connection.query(
                'DELETE FROM sub_tasks WHERE BIN_TO_UUID(sub_task_id) = ?;',
                [subTaskId]
            );

            return subTaskDeleted;
        } catch (e) {
            throw new Error('Error deleting sub task');
        }
    };
}