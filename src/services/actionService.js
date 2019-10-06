import modules from '../models/modules';

/**
 * Persistent actions index which will contain a full list of
 * all actions included within all modules.
 */
const actions = [];

/**
 * Add a new action from the given module.
 * 
 * @param {string} module Name of module that the action is from
 * @param {object} param1 Action object containg the action task name and handler function
 * @param {bool} isDefault Boolean flag indicating if the action is from a default module
 */
const add = (module, { task, handler }, isDefault = false) => {
    actions.push({
        module,
        task,
        handler,
        isDefault,
    });
};

/**
 * Attempt to execute an action by the given task name.
 * 
 * @param {string} task Task name to execute an action for
 */
const execute = async (task) => {
    // Find any actions that include the given task name
    const taskLower = task.toLowerCase();
    const action = actions.filter((act) => taskLower.includes(act.task))[0];

    if (action === undefined) throw new Error(`Unable to find action for task: ${task}`);

    let config = null;

    // If the action is not from a default module, load module config from MongoDB
    if (!('isDefault' in action && action.isDefault)) {
        ({config} = await modules.get(action.module.name));
    }

    // Retrieve any action parameters, which is considered as anything
    // included after the main action task name itself.
    let params = null;
    const possibleParams = taskLower.split(action.task);

    if (possibleParams.length > 1) {
        params = possibleParams[1].trim();
    }

    // Execute the action handler function
    return action.handler(params, config);
}

export default {
    add,
    execute,
};
