import { validateTask, validatePartialTask } from '../schemas/tasks.js'

export class TaskController {

    constructor({ taskModel }) {
        this.taskModel = taskModel;
    }

    getById = async (req, res) => {
        const {taskId} = req.query;
        if (!taskId) return res.status(400).json({ message: 'Task id is required' });
        const task = await this.taskModel.getById({taskId});
        if (task) return res.json(task);
        res.status(404).json({ message: 'Task not found' });
    };

    getByUser = async (req, res) => {
        const { userId } = req.params;
        const tasks = await this.taskModel.getByUser({ userId });
        if (tasks) return res.json(tasks);
        res.status(404).json({ message: 'Tasks not found' });
    };

    create = async (req, res) => {
        const result = validateTask(req.body);
        if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
        const newTask = await this.taskModel.create({ input: result.data });
        if (!newTask) return res.status(404).json({ message: 'User not found' });
        res.status(201).json(newTask)
    };

    update = async (req, res) => {
        const result = validatePartialTask(req.body);
        if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) });
        const { taskId } = req.params;
        const updateTask = await this.taskModel.update({ taskId, input: result.data })
        if (!updateTask) return res.status(404).json({ message: 'Task not found' })
        return res.json(updateTask);
    };

    delete = async (req, res) => {
        const { taskId } = req.params;
        const deletedTask = await this.taskModel.delete({ taskId });
        if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
        return res.json(deletedTask);
    }

    deleteByGroup = async (req, res) => {
        const { groupId } = req.params;
        const deletedTask = await this.taskModel.deleteByGroup({ groupId });
        if (!deletedTask) return res.status(404).json({ message: 'Tasks not found' });
        return res.json(deletedTask);
    }
}