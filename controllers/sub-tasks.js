import { validateSubTask } from '../schemas/sub-tasks.js'

export class SubTaskController {

    constructor({ subTaskModel }) {
        this.subTaskModel = subTaskModel;
    }

    getByTask = async (req, res) => {
        const { taskId } = req.params;
        const subTasks = await this.subTaskModel.getByTask({ taskId });
        if (subTasks) return res.json(subTasks);
        res.status(404).json({ message: 'Sub tasks not found' });
    };

    create = async (req, res) => {
        const result = validateSubTask(req.body);
        if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
        const { taskId } = req.params;
        const newSubTask = await this.subTaskModel.create({ taskId, input: result.data });
        if (!newSubTask) return res.status(404).json({ message: 'Task not found' });
        res.status(201).json(newSubTask)
    };

    update = async (req, res) => {
        const result = validateSubTask(req.body);
        if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) });
        const { subTaskId } = req.params;
        const updateSubTask = await this.subTaskModel.update({ subTaskId, input: result.data })
        if (!updateSubTask) return res.status(404).json({ message: 'Sub task not found' })
        return res.json(updateSubTask);
    };

    delete = async (req, res) => {
        const { subTaskId } = req.params;
        const deletedSubTask = await this.subTaskModel.delete({ subTaskId });
        if (!deletedSubTask) return res.status(404).json({ message: 'Sub task not found' });
        return res.json({ message: 'Sub task deleted' });
    }
}