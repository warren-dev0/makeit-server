import { validateTaskGroup } from '../schemas/tasks-group.js';

export class TaskGroupController {

    constructor({ taskGroupModel }) {
        this.taskGroupModel = taskGroupModel;
    }

    getByUser = async (req, res) => {
        const { userId } = req.params;
        const taskGroup = await this.taskGroupModel.getByUser({ userId });
        if (taskGroup) return res.json(taskGroup);
        res.status(404).json({ message: 'Task group not found' });
    };

    getById = async (req, res) => {
        const { groupId } = req.params;
        const taskGroup = await this.taskGroupModel.getById({ groupId });
        if (taskGroup) return res.json(taskGroup);
        res.status(404).json({ message: 'Task group not found' });
    };

    create = async (req, res) => {
        const result = validateTaskGroup(req.body);
        if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
        const newTaskGroup = await this.taskGroupModel.create({ input: result.data });
        if (!newTaskGroup) return res.status(404).json({ message: 'Task group not found' });
        res.status(201).json(newTaskGroup)
    };

    update = async (req, res) => {
        const result = validateTaskGroup(req.body);
        if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) });
        const { groupId } = req.params;
        const updateTaskGroup = await this.taskGroupModel.update({ groupId, input: result.data })
        if (!updateTaskGroup) return res.status(404).json({ message: 'Task group not found' })
        return res.json(updateTaskGroup);
    };

    delete = async (req, res) => {
        const { groupId } = req.params;
        const deletedTaskGroup = await this.taskGroupModel.delete({ groupId });
        if (!deletedTaskGroup) return res.status(404).json({ message: 'Task group not found' });
        return res.json({ message: 'Task group deleted' });
    }
}