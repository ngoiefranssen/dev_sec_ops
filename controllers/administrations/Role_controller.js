const yup = require('yup');
const { ValidationError } = require('sequelize');
const Role = require('../../db/models/Role_model');
const ProfilRole = require('../../db/models/Profil_role_model');
/**
 * Recupérer la liste des roles
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getRoles = async (req, res) => {
    try {
        const data = await Role.findAndCountAll();

        res.json({
            httpStatus: 200,
            message: 'Roles recupérés avec succès',
            data
        });
    } catch (error) {
        console.error(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Créer un role
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createRole = async (req, res) => {
    // Géstion d'erreur de toute la méthode
    try {
        const registerSchema = yup.lazy(() => yup.object({
            ROLE_NOM: yup.string().required().label('Role'),
            ROLE_DESCRIPTION: yup.string().nullable(),
            PROFILES: yup.array(),
        }));

        // Géstion d'erreur de validation des données
        try {
            await registerSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
        } catch (ex) {
            return res.status(422).json({
                httpStatus: 422,
                message: 'Erreur de validation des données',
                data: null,
                errors: ex.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }

        // Géstion d'erreur d'insertion des données
        try {
            const data = await Role.create(req.body);
            const profilRoles = req.body.PROFILS.map(p => ({ PROFIL_ID: p.PROFIL_ID, ROLE_ID: data.dataValues.ROLE_ID }));

            ProfilRole.bulkCreate(profilRoles);

            res.json({
                httpStatus: 200,
                message: 'Role crée avec succès',
                data: data.toJSON()
            });

        } catch (error) {

            if (error instanceof ValidationError) {
                return res.status(422).json({
                    message: 'Erreur de validation des données',
                    httpStatus: 422,
                    data: null,
                    errors: error?.errors.reduce((acc, curr) => {
                        if (curr.path) {
                            return { ...acc, [curr.path]: curr.message }
                        }
                    }, {})
                });
            }

            res.status(500).json({
                message: 'Erreur interne du serveur',
                httpStatus: 500,
                data: null,
            });
        }



    } catch (error) {
        console.error(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Trouver un seul role
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.ID_role);

        if (!role) {
            return res.status(404).json({
                httpStatus: 400,
                message: 'Role non trouvé',
                data: role
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Role trouvé avec succès',
            data: role
        });
    } catch (error) {
        console.error(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Modifier un role
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateRole = async (req, res) => {
    try {
        const role = await Role.findByPk(req.params.ID_role);

        if (!role) {
            return res.json({
                httpStatus: 404,
                message: 'Role non trouvé',
                data
            });
        }

        const updateSchema = yup.lazy(() => yup.object({
            ROLE_NOM: yup.string().optional(),
            ROLE_DESCRIPTION: yup.string().optional(),
        }));

        const validatedData = await updateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
        const updated = await Role.update(validatedData, { where: { ROLE_ID: req.params.ID_role } })

        res.json({
            httpStatus: 200,
            message: 'Role modifié avec succès',
            data: updated
        });

    } catch (error) {
        console.error(error);

        res.json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

/**
 * Trouver un seul role
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteRole = async (req, res) => {
    try {
        const ROLES = JSON.parse(req.body.ROLE_IDS);

        const roles = await Role.findAll({
            where: { ROLE_ID: ROLES },
            attributes: ['ROLE_ID']
        });

        if (!roles) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Role non trouvé',
                data: null
            });
        }

        await ProfilRole.destroy({ where: { ROLE_ID: ROLES } })
        const deleted = await Role.destroy({ where: { ROLE_ID: ROLES } })

        res.json({
            httpStatus: 200,
            message: 'Role supprimé avec succès',
            data: deleted
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    getRoles,
    createRole,
    getRole,
    updateRole,
    deleteRole
};