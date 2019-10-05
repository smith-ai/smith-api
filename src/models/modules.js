import { db } from '../lib/db';

const modules = async () => {
    return await db.collection('modules');
};

const add = async (name, config = {}) => {
    const coll = await modules();

    return coll.insertOne({
        name,
        config,
    });
};

const all = async () => {
    const coll = await modules();

    return coll.find({});
};

const get = async (name) => {
    const coll = await modules();

    return coll.findOne({ name });
};

const remove = async (name) => {
    const coll = await modules();

    return coll.deleteOne({ name });
};

export default {
    add,
    all,
    get,
    remove,
};
