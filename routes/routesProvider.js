const mainRouter = require('express').Router();

const utilisateursRoutes = require('./utilisateurRoutes')
const authRoutes = require('./authRoutes');
const profilsRouter = require('./profilRoutes');
const rolesRouter = require('./roleRoutes');

mainRouter.use(authRoutes);
mainRouter.use(utilisateursRoutes);
mainRouter.use(profilsRouter)
mainRouter.use(rolesRouter)

module.exports = mainRouter;