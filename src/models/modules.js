import { db } from '../lib/db';

/**
 * Retrieve the modules MongoDB collection instance.
 */
const modules = async () => db.collection('modules');

/**
 * Add a new module by name with the given config.
 *
 * @param {string} name Name of module to add
 * @param {object} config Config object containing any data used by the module in order to run
 */
const add = async (name, config = {}) => {
  const coll = await modules();

  return coll.insertOne({
    name,
    config,
  });
};

/**
 * Retrieve all modules from the MongoDB collection.
 */
const all = async () => {
  const coll = await modules();

  return coll.find({});
};

/**
 * Retrieve a module from the MongoDB collection by name.
 *
 * @param {string} name Name of module to retrieve
 */
const get = async (name) => {
  const coll = await modules();

  return coll.findOne({ name });
};

/**
 * Update an existing module in the MongoDB collection
 * by name.
 *
 * @param {string} name Name of module to update
 * @param {object} config Config data to update
 */
const update = async (name, config = {}) => {
  const coll = await modules();

  return coll.updateOne({ name }, { $set: { config } });
};

/**
 * Remove a module from the MongoDB collection by name.
 *
 * @param {string} name Name of module to remove
 */
const remove = async (name) => {
  const coll = await modules();

  return coll.deleteOne({ name });
};

export default {
  add,
  all,
  get,
  update,
  remove,
};
