# Initialisation du projet

```
npm init -y
```

```
npm i typescript ts-node-dev
```

```
npm i -D jest @types/jest ts-jest
```

```
tsc --init
```

* Pour les tests unitaires et e2e :
```
npm init jest@latest (y/y/node/N/v8/N)
```

* Lib qui permet de facilement manipuler des dates :
```
npm i date-fns
```

```
npm i express @types/express nodemon
```

```
npm i supertest @types/supertest
```

```
npm i uuid @types/uuid
```

```
npm i class-transformer class-validator
```

* Pour les injections de dépendance
```
npm i awilix
```

### Setup de l'environnement Docker de test
* Permet de lancer les containers de test (Docker)
```
npm i testcontainers
```
```
npm i mongoose
```

### Commandes de lancement des tests
* Pour lancer les tests unitaires :
```
npm run test
```

* Pour lancer les tests end to end:
```
npm run test:e2e
```

* Pour lancer le serveur Nodemon:
```
npm start
```