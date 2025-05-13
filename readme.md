<h1>Souche wildleaf pour le backend API</h1>

Cette souche sert comme un modèle à utiliser pour initialiser les nouveaux projets backend pouvant servir les apis web au frontend.
Elle est équipée d'authentification et d'autorisation pour assurer la sécurité des apis.

Pour l'utiliser, veuillez d'abord clôner le projet:
```
git clone https://github.com/ngoiefranssen/dev_sec_ops.git
```

Puis, installer les dépendances nécessaires:
```
npm install
```
Ajouter vos identifiants de la base de données dans le fichier database.js se trouvant ```db/config``` puis lancer la commance ```npx sequelize db:create``` pour générer la base de données automatiquement

Enfin, lancer la commande ```npx sequelize db:migrate``` pour générer les tables par défaut mises à votre disposition et ```npx sequelize db:seed:all``` pour populer un utilisateur par défault.

Félicitations :tada: Vous êtes prêt à demarrer!

:warning: N.B
- Une structure minimale mais plutôt optimale a été adoptée pour faciliter le developpement après l'initialisation du projet. Sentez-vous à l'aise de la modifier à votre propre manière qui vous convient.
- Pour exécuter les tests il faut avoir installé sqlite3 et lancer ```npm run test```