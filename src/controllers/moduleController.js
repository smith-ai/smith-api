import moduleService from '../services/moduleService';

/**
 * Entrypoint for completing authentication for
 * a module.
 *
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 */
const auth = async (req, res) => {
  const { module } = req.params;

  await moduleService.authModule(module, req);

  return res.json(`Successfully authenticated module: ${module}`);
};

export {
  auth,
};
