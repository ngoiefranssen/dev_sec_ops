const utilisateurRouter = require('express').Router();
const UtilisateurController = require('../controllers/administrations/Utilisateur_controller');

const verifToken = require('../middlewares/verifyToken');
const checkPermission = require('../middlewares/checkPermission');

utilisateurRouter.use(verifToken);

utilisateurRouter.get('/utilisateurs', [checkPermission('utilisateurs')], UtilisateurController.getUtilisateurs);
utilisateurRouter.post('/utilisateurs', UtilisateurController.createUtilisateur);
utilisateurRouter.get('/utilisateurs/:ID_utilisateur', UtilisateurController.getUtilisateur);
utilisateurRouter.put('/utilisateurs/:ID_utilisateur', UtilisateurController.updateUtilisateur);
utilisateurRouter.post('/utilisateurs/delete', UtilisateurController.deleteUtilisateur);

module.exports = utilisateurRouter
