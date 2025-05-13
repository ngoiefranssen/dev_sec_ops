const Profil = require('../db/models/Profil_model');
const Role = require('../db/models/Role_model');
const Utilisateur = require('../db/models/Utilisateur_model')

/**
 * @author franssen@mediabox.bi
 *
 * La fonction pour vérifier qu'un utilisateur a le droit(Rôle)
 * pour accèder à un endpoint donné
 *
 * Par ex: checkPermission('utilisateurs') -> vérifier l'accès à l'endpoint /utilisateurs
 */
const checkPermission = (role) => async (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            httpStatus: 401,
            message: "Vous n'êtes pas connecté",
            data: null,
            errors: 'Unauthorized'
        });
    }

    /**
     * Voir si le profil d'un utilisateur
     * connecté a une rôle donné
     */
    const user = await Utilisateur.findOne({
        where: {
            EMAIL: req.user.EMAIL,
            "$PROFILS.ROLES.ROLE_NOM$": role,
        },
        attributes: ['USER_ID'],
        include: {
            model: Profil,
            as: 'PROFILS',
            attributes: ['PROFIL_ID'],
            include: {
                model: Role,
                as: 'ROLES',
                attributes: ['ROLE_ID', 'ROLE_NOM']
            }
        }
    });

    if (!user) {
        return res.status(403).json({
            httpStatus: 403,
            message: "Vous n'êtes pas autorisé",
            data: null,
            errors: 'Forbidden'
        });
    }

    next();
};

module.exports = checkPermission;