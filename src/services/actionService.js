import modules from '../models/modules';

const actions = [];

const add = (module, { task, handler }, isDefault = false) => {
    actions.push({
        module,
        task,
        handler,
        isDefault,
    });
};

const execute = async (task) => {
    const taskLower = task.toLowerCase();
    const action = actions.filter((act) => taskLower.includes(act.task))[0];

    if (action === undefined) throw new Error(`Unable to find action for task: ${task}`);

    let config = null;

    if (!('isDefault' in action && action.isDefault)) {
        ({config} = await modules.get(action.module.name));
    }

    let params = null;
    const possibleParams = taskLower.split(action.task);

    if (possibleParams.length > 1) {
        params = possibleParams[1].trim();
    }

    return action.handler(params, config);
}

export default {
    add,
    execute,
};
