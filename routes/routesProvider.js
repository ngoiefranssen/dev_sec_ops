const mainRouter = require('express').Router();

const utilisateursRoutes = require('./utilisateur_routes')
const authRoutes = require('./auth_routes');
const profilsRouter = require('./profil_routes');
const rolesRouter = require('./role_routes');

mainRouter.use(authRoutes);
mainRouter.use(utilisateursRoutes);
mainRouter.use(profilsRouter)
mainRouter.use(rolesRouter)

module.exports = mainRouter;