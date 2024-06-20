export const userMapperFromMySQL = (user) => {
    const {
        user_id,
        user_avatar,
        user_email,
        user_name,
        user_pass,
        user_1question,
        user_1answer,
        user_2question,
        user_2answer,
        user_3question,
        user_3answer,
        user_date_created
    } = user;

    return {
        id: user_id,
        avatar: user_avatar,
        email: user_email,
        name: user_name,
        hashedpassword: user_pass,
        firstQuestion: user_1question,
        firstAnswer: user_1answer,
        secondQuestion: user_2question,
        secondAnswer: user_2answer,
        thirdQuestion: user_3question,
        thirdAnswer: user_3answer,
        dateCreated: user_date_created
    };
}

export const taskMapperFromMySQL = (task) => {
    const {
        task_id,
        task_title,
        task_due_date,
        task_des,
        task_created_date,
        status_id,
        group_id,
        user_id
    } = task;

    return {
        id: task_id,
        title: task_title,
        dueDate: task_due_date,
        description: task_des,
        createdDate: task_created_date,
        statusId: status_id,
        groupId: group_id,
        userId: user_id
    };
};

export const questionMapperFromMySQL = (question) => {
    const {
        question_id,
        question_des
    } = question;

    return {
        id: question_id,
        description: question_des
    };
};

export const subTaskMapperFromMySQL = (subTask) => {
    const {
        sub_task_id,
        sub_task_title,
        status_id,
        task_id
    } = subTask;

    return {
        id: sub_task_id,
        title: sub_task_title,
        statusId: status_id,
        taskId: task_id
    };
};

export const taskStatusMapperFromMySQL = (taskStatus) => {
    const {
        status_id,
        status_des
    } = taskStatus;

    return {
        id: status_id,
        description: status_des
    }
};

export const taskGroupMapperFromMySQL = (taskGroup) => {
    const {
        group_id,
        group_des,
        group_color,
        user_id
    } = taskGroup;

    return {
        id: group_id,
        description: group_des,
        color: group_color,
        userId: user_id
    }
};

