const yup = require("yup");
const Utilisateur = require("../../db/models/utilisateurModel");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");
const { ValidationError } = require("sequelize");
const Profil = require("../../db/models/profilModel");
const Role = require("../../db/models/roleModel");

/**
 * Authentifier un utilisateur
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
const login = async (req, res) => {
    try {

        const { EMAIL, PASSWORD } = req.body;

        const loginSchema = yup.object({
            EMAIL: yup.string().email().required(),
            PASSWORD: yup.string().required()
        });

        try {
            await loginSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
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

        const utilisateur = await Utilisateur.findOne({
            where: { EMAIL },
            include: {
                model: Profil,
                as: 'PROFILS',
                through: { attributes: [] },
                include: {
                    model: Role,
                    as: 'ROLES',
                    through: { attributes: [] },
                }
            }
        });

        // Vérifier si l'utilisateur n'existe pas dans la base
        if (!utilisateur) {
            return res.status(422).json({
                httpStatus: 422,
                message: "Erreur de validation des données",
                data: null,
                errors: { EMAIL: "Identifiants incorrects" }
            })
        }

        // Vérifier si l'utilisateur a mal saisi son mot de passe
        if (!(await bcrypt.compare(PASSWORD, utilisateur.PASSWORD))) {
            return res.status(422).json({
                httpStatus: 422,
                message: "Erreur de validation des données",
                data: null,
                errors: { EMAIL: "Identifiants incorrects" }
            })
        }

        // Il faut jamais divulguer le mot de passe
        delete utilisateur.dataValues.PASSWORD;

        const token = jwt.sign(
            { EMAIL: utilisateur.EMAIL, },
            process.env.JWT_PRIVATE_KEY, {
            expiresIn: "1h",
        })

        return res.json({
            httpStatus: 200,
            message: 'Utilisateur connecté avec succès',
            data: {
                ...utilisateur.dataValues, token
            }
        })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
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
const changePassword = async (req, res) => {
    const { USER_ID, CURRENT_PASSWORD, PASSWORD } = req.body;

    // Géstion d'erreur de toute la méthode
    const passwordSchema = yup.lazy(() => yup.object({
        USER_ID: yup.number().required(),
        CURRENT_PASSWORD: yup.string().required(),
        PASSWORD: yup.string().required().min(8),
        CONFIRM_PASSWORD: yup.string().required().oneOf([yup.ref('PASSWORD'), null], 'Passwords must match'),
    }));

    // Géstion d'erreur de validation des données
    try {
        passwordSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
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
        const utilisateur = await Utilisateur.findByPk(USER_ID);

        if (!utilisateur) {
            return res.status(404).json({
                httpStatus: 404,
                message: "Utilisateur non trouvé",
                data: null
            })
        }

        // const salt = await bcrypt.genSalt(10)
        // const PASSWORD = await bcrypt.hash(req.body.CURRENT_PASSWORD, salt)

        if (!(await bcrypt.compare(CURRENT_PASSWORD, utilisateur.PASSWORD))) {
            return res.status(422).json({
                httpStatus: 422,
                message: "Erreur de validation des données",
                data: null,
                errors: { CURRENT_PASSWORD: "Mauvais mot de passe fourni" }
            })
        }

        const salt = await bcrypt.genSalt(10)
        const NEW_PASSWORD = await bcrypt.hash(PASSWORD, salt)

        await Utilisateur.update(
            { PASSWORD: NEW_PASSWORD },
            { where: { USER_ID: req.body.USER_ID } }
        );

        res.status(200).json({
            httpStatus: 201,
            message: 'Mot passe changé avec succès',
            data: null
        });

    } catch (error) {

        res.status(500).json({
            message: 'Erreur interne du serveur',
            httpStatus: 500,
            data: null
        })
    }
}

module.exports = {
    login,
    changePassword
}