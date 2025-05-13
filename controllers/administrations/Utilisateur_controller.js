const yup = require('yup');
const Utilisateur = require('../../db/models/Utilisateur_model');
const ProfilUtilisateur = require('../../db/models/Profil_utilisateur_model')
const bcrypt = require('bcrypt');
const { ValidationError } = require('sequelize');
const Upload = require('../../utils/Upload');
const Profil = require('../../db/models/Profil_model');

/**
 * Recupérer la liste des utilisateurs
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns
 */
const getUtilisateurs = async (req, res) => {
    try {
        const data = await Utilisateur.findAndCountAll({ attributes: { exclude: 'PASSWORD' } });

        res.json({
            httpStatus: 200,
            message: 'Utilisateurs recupérés avec succès',
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
 * Créer un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const createUtilisateur = async (req, res) => {

    const PROFIL_PICTURE = req.files?.PROFIL_PICTURE
    const PROFILS = JSON.parse(req.body.PROFILS || '[]')

    // Géstion d'erreur de toute la méthode
    const utilisateurSchema = yup.lazy(() => yup.object({
        USERNAME: yup.string().required(),
        EMAIL: yup.string().email().required(),
        PASSWORD: yup.string().required().min(8),
        CONFIRM_PASSWORD: yup.string().required().oneOf([yup.ref('PASSWORD'), null], 'Passwords must match'),
        NOM: yup.string().required(),
        PRENOM: yup.string().required(),
        TELEPHONE1: yup.string().notRequired(),
        TELEPHONE1: yup.string().notRequired(),
        ADRESSE: yup.string().notRequired(),

        PROFIL_PICTURE: yup.mixed("you here").test("fileSize", "Le fichier est trop volumineux", (value) => {
            if (!value?.size) return true // attachment is optional
            return value.size <= 200_000
        }),

        PROFILS: yup.array()
    }));

    let validatedData;

    // Géstion d'erreur de validation des données
    try {
        validatedData = await utilisateurSchema.validate(
            {
                ...req.body,
                PROFIL_PICTURE,
                PROFILS
            },
            { abortEarly: false, stripUnknown: true }
        );
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

        const uploadedFile = PROFIL_PICTURE ? await Upload.save(PROFIL_PICTURE, { destination: 'utilisateurs' }) : {};

        const salt = await bcrypt.genSalt(10)
        const PASSWORD = await bcrypt.hash(validatedData.PASSWORD, salt)

        const data = await Utilisateur.create({
            ...validatedData,
            PROFIL_PICTURE: uploadedFile?.fileInfo?.fileName,
            PASSWORD
        });

        delete data.dataValues.PASSWORD

        if (validatedData.PROFILS) {

            ProfilUtilisateur.bulkCreate(
                validatedData.PROFILS.map(profil => ({
                    USER_ID: data.dataValues.USER_ID,
                    PROFIL_ID: profil?.PROFIL_ID
                }))
            )
        }

        res.status(201).json({
            httpStatus: 201,
            message: 'Utilisateur crée avec succès',
            data: data.dataValues
        });

    } catch (error) {
        console.log(error);
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
            data: null
        })
    }
}

/**
 * Trouver un seul utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const getUtilisateur = async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByPk(req.params.ID_utilisateur, {
            attributes: { exclude: 'PASSWORD' },
            include: {
                model: Profil,
                as: 'PROFILS',
                through: { attributes: [] }
            }
        });

        if (!utilisateur) {
            return res.status(404).json({
                httpStatus: 200,
                message: 'Utilisateur non trouvé',
                data: utilisateur
            });
        }

        res.json({
            httpStatus: 200,
            message: 'Utilisateurs trouvé avec succès',
            data: utilisateur
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
 * Modifier un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const updateUtilisateur = async (req, res) => {
    try {

        const utilisateur = Utilisateur.findByPk(req.params.ID_utilisateur);

        if (!utilisateur) {

            return res.status(404).json({
                httpStatus: 404,
                message: 'Utilisateur non trouvé',
                data: null
            });

        }

        const PROFIL_PICTURE = req.files?.PROFIL_PICTURE
        const PROFILS = JSON.parse(req.body.PROFILS || '[]')

        let validatedData;

        try {
            const updateSchema = yup.lazy(() => yup.object({
                USERNAME: yup.string().optional(),
                EMAIL: yup.string().email().optional(),
                NOM: yup.string().optional(),
                PRENOM: yup.string().optional(),
                TELEPHONE1: yup.string().optional(),
                TELEPHONE2: yup.string().optional(),
                ADRESSE: yup.string().optional(),

                PROFIL_PICTURE: yup.mixed().test("fileSize", "Le fichier est trop volumineux", (value) => {
                    if (!value?.size) return true // attachment is optional
                    return value.size <= 200_000
                }),

                PROFILS: yup.array()
            }));

            validatedData = await updateSchema.validate(
                {
                    ...req.body,
                    PROFIL_PICTURE,
                    PROFILS
                }, { abortEarly: false, stripUnknown: true });

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

        const uploadedFile = PROFIL_PICTURE ? await Upload.save(PROFIL_PICTURE, 'utilisateurs') : {};

        await Utilisateur.update({
            ...validatedData,
            PROFIL_PICTURE: uploadedFile?.fileInfo?.fileName,
        }, {
            where: { USER_ID: req.params.ID_utilisateur },
            returning: true,
        })

        if (validatedData.PROFILS) {

            ProfilUtilisateur.destroy({ where: { USER_ID: req.params.ID_utilisateur } })

            ProfilUtilisateur.bulkCreate(
                validatedData.PROFILS.map(profil => ({
                    USER_ID: req.params.ID_utilisateur,
                    PROFIL_ID: profil?.PROFIL_ID
                })), {
                updateOnDuplicate: ['USER_ID', 'PROFIL_ID'],
            }
            )
        }

        res.json({
            httpStatus: 200,
            message: 'Utilisateur modifié avec succès',
            data: utilisateur
        });


    } catch (error) {
        console.log(error);

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
            data: error.message
        })
    }
}

/**
 * Trouver un seul utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const deleteUtilisateur = async (req, res) => {
    try {
        const USERS = JSON.parse(req.body.USER_IDS);

        await ProfilUtilisateur.destroy({ where: { USER_ID: USERS } })
        await Utilisateur.destroy({ where: { USER_ID: USERS } })

        res.json({
            httpStatus: 200,
            message: `${USERS.length} utilisateur(s) supprimé(s) avec succès`,
            data: null
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
    getUtilisateurs,
    createUtilisateur,
    getUtilisateur,
    updateUtilisateur,
    deleteUtilisateur
};