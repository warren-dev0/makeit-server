import { connection } from './connection.js';
import { taskGroupMapperFromMySQL } from '../../mappers/from-mysql.js';
import { taskGroupMapperToMySQL } from '../../mappers/to-mysql.js';

export class TaskGroupModel {

    static async getByUser({ userId }) {

        const user = connection.query(
            'SELECT * FROM users WHERE (BIN_TO_UUID(user_id)) = ?', [userId]
        );

        if (user.length === 0) return null;

        const [tasksGroupNotMappered] = await connection.query(
            'SELECT group_id, group_des, group_color FROM task_group WHERE group_id = 1 OR (BIN_TO_UUID(user_id)) = ?', [userId]
        );

        if (tasksGroupNotMappered.length === 0) return null;

        const tasksGroup = tasksGroupNotMappered.map(taskGroup => {
            return taskGroupMapperFromMySQL(taskGroup);
        })

        return tasksGroup;
    };

    static async getById({ groupId }) {

        const user = connection.query(
            'SELECT * FROM task_group WHERE group_id = ?', [groupId]
        );

        if (user.length === 0) return null;

        const [tasksGroupNotMappered] = await connection.query(
            'SELECT group_id, group_des, group_color FROM task_group WHERE group_id = ?', [groupId]
        );

        if (tasksGroupNotMappered.length === 0) return null;

        const tasksGroup = tasksGroupNotMappered.map(taskGroup => {
            return taskGroupMapperFromMySQL(taskGroup);
        })

        return tasksGroup;
    };

    static async create({ input }) {
        const {
            description,
            color,
            userId
        } = input;

        const user = connection.query(
            'SELECT * FROM users WHERE (BIN_TO_UUID(user_id)) = ?', [userId]
        );

        if (user.length === 0) return null;

        const newTaskGroup = taskGroupMapperToMySQL({ description, color, userId });

        Object.keys(newTaskGroup).forEach((key) => {
            if (newTaskGroup[key] === undefined || newTaskGroup[key] === null || newTaskGroup[key] === '') delete newTaskGroup[key];
        });

        try {
            await connection.query(
                `INSERT INTO task_group SET group_des = ?, group_color = ?, user_id = UUID_TO_BIN(?);`, [description, color, userId]
            );
        } catch (e) {
            throw new Error('Error creating task group');
        }

        let [createdTaskGroup] = await connection.query(
            'SELECT group_id, group_des, group_color FROM task_group WHERE group_des = ? AND group_color = ? AND user_id = UUID_TO_BIN(?);', [description, color, userId]
        );

        createdTaskGroup = taskGroupMapperFromMySQL(createdTaskGroup[0]);

        return createdTaskGroup;

    };

    static async update({ groupId, input }) {
        const {
            description,
            color
        } = input;

        if(groupId === 1) return null;

        const [taskGroup] = await connection.query(
            'SELECT * FROM task_group WHERE group_id = ?;', [groupId]
        );

        if (taskGroup.length === 0) return null;

        const valuesToUpdate = taskGroupMapperToMySQL({ description, color });

        Object.keys(valuesToUpdate).forEach((key) => {
            if (valuesToUpdate[key] === undefined || valuesToUpdate[key] === null || valuesToUpdate[key] === '') delete valuesToUpdate[key];
        });

        const keys = Object.keys(valuesToUpdate);
        const values = Object.values(valuesToUpdate);

        const updateQuery = keys.map((key) => `${key} = ?`).join(', ');

        try {
            await connection.query(
                `UPDATE task_group SET ${updateQuery} WHERE group_id = ?;`, [...values, groupId]
            );
        } catch (e) {
            throw new Error('Error updating task group');
        }

        let [updatedTaskGroup] = await connection.query(
            'SELECT group_id, group_des, group_color FROM task_group WHERE group_id = ?;', [groupId]
        );

        updatedTaskGroup = taskGroupMapperFromMySQL(updatedTaskGroup[0]);

        Object.keys(updatedTaskGroup).forEach((key) => {
            if (updatedTaskGroup[key] === undefined || updatedTaskGroup[key] === null || updatedTaskGroup[key] === '') delete updatedTaskGroup[key];
        });

        return updatedTaskGroup;

    };

    static async delete({ groupId }) {

        if(groupId === 1) return null;

        const [taskGroup] = await connection.query(
            'SELECT * FROM task_group WHERE group_id = ?;', [groupId]
        );

        if (taskGroup.length === 0) return null;

        try {
            const [taskGroupDeleted] = await connection.query(
                'DELETE FROM task_group WHERE group_id = ?;', [groupId]
            );

            return taskGroupDeleted;
        } catch (e) {
            throw new Error('Error deleting task group');
        }
    };
}