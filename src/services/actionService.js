const actions = [];

const add = (module, { task, handler }) => {
    actions.push({
        module,
        task,
        handler,
    });
};

const execute = (task) => {
    const taskLower = task.toLowerCase();
    const action = actions.filter((act) => taskLower.includes(act.task))[0];

    let params = null;
    const possibleParams = taskLower.split(action.task);

    if (possibleParams.length > 1) {
        params = possibleParams[1].trim();
    }

    return action.handler(params);
}

export default {
    add,
    execute,
};
