const request = require('supertest');
const app = require('../../src/app');
const Utilisateur = require('../../src/db/models/Utilisateur_model');
const sequelize = require('../../src/db/models').sequelize;
const bcrypt = require('bcrypt');
const Profil = require('../../src/db/models/Profil_model');
const Role = require('../../src/db/models/Role_model');
const ProfilUtilisateur = require('../../src/db/models/Profil_utilisateur_model');
const ProfilRole = require('../../src/db/models/Profil_role_model');
const fs = require('fs/promises')

let user, token = '';

beforeAll(async () => {
    await sequelize.sync({ force: true })

    const salt = await bcrypt.genSalt()
    const PASSWORD = await bcrypt.hash('12345678', salt)

    const body = {
        USERNAME: "franssen",
        EMAIL: "franssen@example.org",
        NOM: "Ngoie",
        PRENOM: "Franssen",
        PASSWORD
    }

    user = await Utilisateur.create(body);

    // profil?.addRole(role);
    // user?.addProfil(profil)

    const res = await request(app).post('/api/login').send({ EMAIL: body.EMAIL, PASSWORD: '12345678' });
    token = res.body.data.token
})

describe.only('Utilisateurs', () => {
    it.only("ça recupère pas les utilisateurs sans autorisation", async () => {
        const res = await request(app).get('/api/utilisateurs').set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(403);
        expect(res.body.errors).toEqual("Forbidden");
    })

    it.only("ça recupère tous les utilisateurs", async () => {

        const profil = await Profil.create({ PROFIL_NOM: 'Secretaire' });
        ProfilUtilisateur.create({ USER_ID: user.USER_ID, PROFIL_ID: profil.PROFIL_ID })

        const role = await Role.create({ ROLE_NOM: 'utilisateurs' });
        ProfilRole.create({ PROFIL_ID: profil.PROFIL_ID, ROLE_ID: role.ROLE_ID })

        const res = await request(app).get('/api/utilisateurs').set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body.data.count).toEqual(1)
        expect(res.body.data.rows).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ "USERNAME": "agahebeye", "EMAIL": "agahebeye@example.org" })
            ])
        )
    })

    it.only("ça recupère un seul utilisateur", async () => {
        const res = await request(app).get('/api/utilisateurs/1').set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(200);
        expect(res.body.data).toEqual(
            expect.objectContaining({ "USERNAME": "agahebeye", "EMAIL": "agahebeye@example.org" })
        )
    })

    it.only("ça retourne 404 pour un utilisateur non trouvé", async () => {
        const res = await request(app).get('/api/utilisateurs/999').set('Authorization', `Bearer ${token}`);

        expect(res.status).toEqual(404);
    })

    it.only("ça crée un nouveau utilisateur", async () => {
        const body = {
            USERNAME: "franssen",
            EMAIL: "franssen@example.org",
            PASSWORD: '12345678',
            CONFIRM_PASSWORD: '12345678',
            NOM: "Ngoie",
            PRENOM: "Franssen"
        }

        const res = await request(app).post('/api/utilisateurs')
            .set('Authorization', `Bearer ${token}`)
            .send(body);

        expect(res.status).toEqual(201);
        expect(res.body.data).toEqual(
            expect.objectContaining({ "USERNAME": "franssen", "EMAIL": "franssen@example.org" })
        )
    })

    it.only("ça crée un nouveau utilisateur avec le profil image", async () => {
        const filePath = `${__dirname}/../../__tests__/files/presence.jpg`;

        try {
            await fs.access(filePath);
        } catch {
            throw new Error("Le fichier n'existe pas");
        }

        const res = await request(app).post('/api/utilisateurs')
            .set('Authorization', `Bearer ${token}`)
            .field('USERNAME', 'ramses')
            .field('EMAIL', 'amanimamba@gmail.org')
            .field('PASSWORD', '12345678')
            .field('CONFIRM_PASSWORD', '12345678')
            .field('NOM', 'Amani')
            .field('PRENOM', 'Mamba')
            .attach('PROFIL_PICTURE', filePath)

        console.log(res)

        expect(res.status).toEqual(201);
        expect(res.body.data).toEqual(
            expect.objectContaining({ "USERNAME": "ramses", "EMAIL": "amanimamba@gmail.org" })
        )
        expect(res.body.data.PROFIL_PICTURE).not.toBeNull();
    })

    it.only("ça modifie un utilisateur", async () => {
        const body = {
            USERNAME: "ramses",
            EMAIL: "ramses@example.org",
        }

        const res = await request(app).put('/api/utilisateurs/1')
            .set('Authorization', `Bearer ${token}`)
            .send(body);

        expect(res.status).toEqual(200);
        // expect(res.body.data).toEqual(
        //     expect.objectContaining({ "USERNAME": "ramses", "EMAIL": "ramses@example.org" })
        // )
    })

    it.only("ça supprime un utilisateur", async () => {

        const res = await request(app).post('/api/utilisateurs/delete')
            .set('Authorization', `Bearer ${token}`)
            .send({ 'USER_IDS': JSON.stringify([1]) })

        expect(res.status).toEqual(200);

        const deletedUtilisateur = await Utilisateur.findByPk(1);
        expect(deletedUtilisateur).toBeNull();
    })
})