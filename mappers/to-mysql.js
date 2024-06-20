export const userMapperToMySQL = (user) => {
    const {
        id,
        avatar,
        email,
        name,
        hashedpassword,
        firstQuestion,
        hashedFirstAnswer,
        secondQuestion,
        hashedSecondAnswer,
        thirdQuestion,
        hashedThirdAnswer,
        dateCreated,
    } = user;

    return {
        user_id: id,
        user_avatar: avatar,
        user_email: email,
        user_name: name,
        user_pass: hashedpassword,
        user_1question: firstQuestion,
        user_1answer: hashedFirstAnswer,
        user_2question: secondQuestion,
        user_2answer: hashedSecondAnswer,
        user_3question: thirdQuestion,
        user_3answer: hashedThirdAnswer,
        user_date_created: dateCreated
    };
}

export const taskMapperToMySQL = (task) => {
    const {
        id,
        title,
        dueDate,
        description,
        createdDate,
        statusId,
        groupId,
        userId,
    } = task;

    return {
        task_id: id,
        task_title: title,
        task_due_date: dueDate,
        task_des: description,
        task_created_date: createdDate,
        status_id: statusId,
        group_id: groupId,
        user_id: userId
    };
};


export const subTaskMapperToMySQL = (subTask) => {
    const {
        id,
        title,
        statusId,
        taskId,
    } = subTask;

    return {
        sub_task_id: id,
        sub_task_title: title,
        status_id: statusId,
        task_id: taskId
    };
};

export const taskGroupMapperToMySQL = (taskGroup) => {
    const {
        id,
        description,
        color,
        userId
    } = taskGroup;

    return {
        group_id: id,
        group_des: description,
        group_color: color,
        user_id: userId
    }
}