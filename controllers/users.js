import { validateUser, validatePartialUser } from '../schemas/users.js'

export class UserController {

    constructor({ userModel }) {
        this.userModel = userModel;
    }

    login = async (req, res) => {
        const result = validatePartialUser(req.body);
        if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) });
        const user = await this.userModel.login({ input: result.data });
        if (!user) return res.status(404).json({ message: 'Invalid credentials' });
        return res.json(user);
    }

    getById = async (req, res) => {
        const { userId } = req.params;
        const user = await this.userModel.getById({ userId });
        if (user) return res.json(user);
        res.status(404).json({ message: 'User not found' });
    };

    create = async (req, res) => {
        const result = validateUser(req.body);
        if (result.error) return res.status(400).json({ error: JSON.parse(result.error.message) })
        const newUser = await this.userModel.create({ input: result.data });
        if (!newUser) return res.status(404).json({ message: 'Invalid data provided for user creation' });
        res.status(201).json(newUser);
    };

    update = async (req, res) => {
        const result = validatePartialUser(req.body);
        if (!result.success) return res.status(404).json({ error: JSON.parse(result.error.message) });
        const { userId } = req.params;
        const updatedUser = await this.userModel.update({ userId, input: result.data })
        if (!updatedUser) return res.status(404).json({ message: 'User not found' })
        return res.json(updatedUser);
    };

    delete = async (req, res) => {
        const { userId } = req.params;
        const deletedUser = await this.userModel.delete({ userId });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        return res.json({ message: 'User deleted' });
    }
}