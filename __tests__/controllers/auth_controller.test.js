const request = require('supertest');
const app = require('../src/app');
const Utilisateur = require('../src/db/models/Utilisateur_model');
const bcrypt = require('bcrypt');
const sequelize = require('../src/db/models').sequelize;

beforeAll(async () => {
    await sequelize.sync({ force: true })
})

describe('Authentification', () => {
    it.only('ça doit pas connecter un utilisateur sans identifiants', async () => {
        const res = await request(app).post('/api/login');

        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toBe('Erreur de validation des données')
        expect(res.body.errors).toBeDefined();
    })

    it.only('ça doit pas connecter un utilisateur avec identifiants incorrects', async () => {
        const body = {
            EMAIL: 'hafidati@example.org',
            PASSWORD: 'wrong-password-12345'
        }
        const res = await request(app).post('/api/login').send(body);

        expect(res.statusCode).toEqual(422);
        expect(res.body.errors).toEqual(expect.objectContaining({ EMAIL: 'Identifiants incorrects' }))
    })

    it.only('ça doit recupèrer tous les utiliseurs', async () => {

        const salt = await bcrypt.genSalt()
        const PASSWORD = await bcrypt.hash('12345678', salt)

        const body = {
            USERNAME: "franssen",
            EMAIL: "franssen@example.org",
            NOM: "Franssen",
            PRENOM: "Franssen",
            PASSWORD,
        }

        Utilisateur.create(body);

        const res = await request(app).post('/api/login').send({ EMAIL: body.EMAIL, PASSWORD: '12345678' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.data.token).toBeDefined();
    })
})