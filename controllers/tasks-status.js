export class TaskStatusController {

    constructor({ taskStatusModel }) {
        this.taskStatusModel = taskStatusModel;
    }

    getAll = async (req, res) => {
        const tasksStatus = await this.taskStatusModel.getAll();
        if (tasksStatus) return res.json(tasksStatus);
        res.status(404).json({ message: 'Tasks status not found' });
    };
}