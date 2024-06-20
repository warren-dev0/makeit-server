import { connection } from './connection.js';
import { taskMapperToMySQL } from '../../mappers/to-mysql.js';
import { taskMapperFromMySQL } from '../../mappers/from-mysql.js';

export class TaskModel {

    static async getByUser({ userId }) {
        const [tasksNotMappered] = await connection.query(
            'SELECT BIN_TO_UUID(task_id) task_id, task_title, task_due_date, task_des, task_created_date, status_id, group_id, BIN_TO_UUID(user_id) user_id FROM tasks WHERE BIN_TO_UUID(user_id) = ?;', [userId]
        );

        if (tasksNotMappered.length === 0) return null;

        const tasks = tasksNotMappered.map(task => {
            return taskMapperFromMySQL(task);
        })

        return tasks;
    };

    static async create({ input }) {
        const {
            title,
            dueDate,
            description,
            groupId,
            userId
        } = input;

        const [user] = await connection.query(
            'SELECT BIN_TO_UUID(user_id) user_id FROM users WHERE BIN_TO_UUID(user_id) = ?;', [userId]
        );

        if (user.length === 0) return false;

        const [taskUuid] = await connection.query('SELECT UUID() uuid;');
        const [{ uuid }] = taskUuid;

        const createdDate = new Date();

        const statusId = 1;

        const newTask = taskMapperToMySQL({ title, dueDate, description, createdDate, statusId, groupId });

        Object.keys(newTask).forEach((key) => {
            if(newTask[key] === undefined || newTask[key] === null || newTask[key] === '') delete newTask[key];
        });

        newTask.task_title = `'${newTask.task_title}'`;
        if(newTask.task_due_date) {newTask.task_due_date = `'${newTask.task_due_date}'`;};
        if(newTask.task_des) {newTask.task_des = `'${newTask.task_des}'`;};
        newTask.task_created_date = `'${newTask.task_created_date}'`;

        const taskKeys = Object.keys(newTask).join(', ');
        const taskValues = Object.values(newTask).join(', ');

        try {
            await connection.query(
                `INSERT INTO tasks (task_id, ${taskKeys}, user_id) VALUES ((UUID_TO_BIN('${uuid}')), ${taskValues}, (UUID_TO_BIN('${userId}')));`
            );
        } catch (e) {
            return false;
        }

        let [createdTask] = await connection.query(
            'SELECT BIN_TO_UUID(task_id) task_id, task_title, task_due_date, task_des, task_created_date, status_id, group_id, BIN_TO_UUID(user_id) user_id FROM tasks WHERE BIN_TO_UUID(task_id) = ?;', [uuid]
        );

        createdTask = taskMapperFromMySQL(createdTask[0]);

        return createdTask;

    };

    static async update({ taskId, input }) {
        const {
            title,
            dueDate,
            description,
            groupId,
            statusId
        } = input;

        const [task] = await connection.query(
            'SELECT BIN_TO_UUID(task_id) task_id FROM tasks WHERE BIN_TO_UUID(task_id) = ?;', [taskId]
        );

        if (task.length === 0) return null;

        const valuesToUpdate = taskMapperToMySQL({ title, dueDate, description, groupId, statusId });

        Object.keys(valuesToUpdate).forEach((key) => {
            if(valuesToUpdate[key] === undefined || valuesToUpdate[key] === null || valuesToUpdate[key] === '') delete valuesToUpdate[key];
        });

        const keys = Object.keys(valuesToUpdate);
        const values = Object.values(valuesToUpdate);

        const updateQuery = keys.map((key) => `${key} = ?`).join(', ');

        try {
            await connection.query(
                `UPDATE tasks SET ${updateQuery} WHERE BIN_TO_UUID(task_id) = ?;`,
                [...values, taskId]
            );
        } catch (e) {
            return false;
        }

        let [updatedTask] = await connection.query(
            'SELECT BIN_TO_UUID(task_id) task_id, task_title, task_due_date, task_des, task_created_date, status_id, group_id, BIN_TO_UUID(user_id) user_id FROM tasks WHERE BIN_TO_UUID(task_id) = ?;', [taskId]
        );

        updatedTask = taskMapperFromMySQL(updatedTask[0]);

        Object.keys(updatedTask).forEach((key) => {
            if (updatedTask[key] === undefined || updatedTask[key] === null || updatedTask[key] === '') delete updatedTask[key];
        });

        return updatedTask;

    };

    static async delete({ taskId }) {

        const [task] = await connection.query(
            'SELECT * FROM tasks WHERE BIN_TO_UUID(task_id) = ?;', [taskId]
        );

        if (task.length === 0) return null;

        try {
            const [taskDeleted] = await connection.query(
                'DELETE FROM tasks WHERE BIN_TO_UUID(task_id) = ?;',
                [taskId]
            );

            return taskDeleted;
        } catch (e) {
            return false;
        }
    };
}