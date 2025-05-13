const yup = require('yup');
const Profil = require('../../db/models/profilModel');
const { ValidationError } = require('sequelize');
const Role = require('../../db/models/roleModel');
const ProfilRole = require('../../db/models/profilRoleModel');

/**
 * Recupérer la liste des profils
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getProfils = async (req, res) => {
    try {
        const { include } = req.query;

        const options = {};

        /**
         * Passer le modèle à include coe des paramètres
         * ex: ?include=Roles
         */
        if (include === 'Roles') {
            options.include = {
                model: Role,
                through: {attributes: []},
                as: 'ROLES'
            }
        }

        const data = await Profil.findAndCountAll(options);

        res.json({
            httpStatus: 200,
            message: 'Profils recupérés avec succès',
            data
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

/**
 * Créer un profil
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createProfil = async (req, res) => {
    // Géstion d'erreur de toute la méthode
    try {
        const profilSchema = yup.lazy(() => yup.object({
            PROFIL_NOM: yup.string().required(),
            DESCRIPTION: yup.string().nullable(),
        }));

        // Géstion d'erreur de validation des données
        try {
            await profilSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
        } catch (error) {
            return res.status(422).json({
                httpStatus: 422,
                message: 'Erreur de validation des données',
                data: null,
                errors: error.inner.reduce((acc, curr) => {
                    if (curr.path) {
                        return { ...acc, [curr.path]: curr.errors[0] }
                    }
                }, {}),
            })
        }

        // Géstion d'erreur d'insertion des données
        try {
            const data = await Profil.create(req.body);

            res.json({
                httpStatus: 200,
                message: 'Profil crée avec succès',
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

            return res.status(httpStatus).json({
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
 * Trouver un seul profil
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getProfil = async (req, res) => {
    try {
        const profil = await Profil.findByPk(req.params.ID_profil);

        if (!profil) {
            return res.status(404).json({
                httpStatus: 200,
                message: 'Profil non trouvé',
                data: profil
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Profils trouvé avec succès',
            data: profil
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
 * Modifier un profil
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateProfil = async (req, res) => {
    try {
        const profil = await Profil.findByPk(req.params.ID_profil);

        if (!profil) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Profil non trouvé',
                data: profil,
            });
        }

        try {
            const updateSchema = yup.lazy(() => yup.object({
                PROFIL_NOM: yup.string().optional(),
                DESCRIPTION: yup.string().optional(),
            }));

            const validatedData = await updateSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
            const updated = await Profil.update(validatedData, { where: { PROFIL_ID: req.params.ID_profil } })

            res.json({
                httpStatus: 200,
                message: 'Profil modifié avec succès',
                data: updated
            });
        } catch (error) {

            res.status(500).json({
                message: 'Erreur interne du serveur',
                httpStatus,
                data: null,
                errors: error?.errors
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
 * Trouver un seul profil
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteProfil = async (req, res) => {
    try {
        const PROFILS = JSON.parse(req.body.PROFIL_IDS);

        const profils = await Profil.findAll({
            where: { PROFIL_ID: PROFILS },
            attributes: ['PROFIL_ID']
        });

        if (!profils) {
            return res.status(404).json({
                httpStatus: 404,
                message: 'Profil non trouvé',
                data: null
            });
        }

        await ProfilRole.destroy({ where: { PROFIL_ID: PROFILS } })
        const deleted = await Profil.destroy({ where: { PROFIL_ID: PROFILS } })

        res.json({
            httpStatus: 200,
            message: 'Profil supprimé avec succès',
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
    getProfils,
    createProfil,
    getProfil,
    updateProfil,
    deleteProfil
};