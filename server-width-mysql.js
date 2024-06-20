import { createApp } from "./app.js";

import { TaskModel } from './models/mysql/task.js';
import { SubTaskModel } from './models/mysql/sub-task.js';
import { UserModel } from './models/mysql/user.js';
import { QuestionModel } from './models/mysql/question.js';
import { TaskStatusModel } from './models/mysql/task-status.js';
import { TaskGroupModel } from './models/mysql/task-group.js';

createApp({ taskModel: TaskModel, subTaskModel: SubTaskModel, userModel: UserModel, questionModel: QuestionModel, taskStatusModel: TaskStatusModel, taskGroupModel: TaskGroupModel });