---
title: "Valider les entrées d'une API avec Zod en TypeScript"
subtitle: "TypeScript ne vérifie plus rien une fois votre application lancée. Voici comment valider les corps de requête, les variables d'environnement et les réponses d'API avec un seul schéma Zod, qui vous donne aussi le type."
date: 2026-09-18
tags: ["TypeScript", "Validation", "Zod"]
cover: ./cover.webp
coverAlt: "Le logo de Zod, un bouclier bleu marqué d'un Z blanc, sur fond blanc"
draft: false
---

TypeScript détecte une grande partie des bugs avant même que le code ne s'exécute. Il vérifie que les fonctions reçoivent les arguments attendus, que les objets possèdent les propriétés que nous lisons, et que nous ne passons pas une chaîne là où un nombre est attendu. Mais cette protection s'arrête à la compilation. Une fois le code compilé en JavaScript, les types ont disparu.

Cela devient un problème dès que des données viennent de l'extérieur de l'application. Un corps de requête, une query string, une variable d'environnement ou la réponse d'une API tierce ne sont pas vérifiés par le compilateur. Une annotation de type sur ces données n'est qu'une promesse : rien ne la vérifie à l'exécution.

Dans cet article, nous verrons pourquoi les types seuls ne suffisent pas aux frontières d'un backend, et comment Zod comble ce manque. Nous verrons ce qu'est Zod, comment il se compare à ses alternatives, les règles qui font qu'une validation protège vraiment une API, puis nous construirons la validation des requêtes, la vérification de l'environnement et la documentation à partir d'un seul schéma.

## Compilation et exécution

TypeScript est un système de types **statique**. Il analyse le code avant son exécution, puis retire toutes les annotations de type quand il produit le JavaScript.

Un type ne peut donc décrire que des données que le compilateur voit. Les données qui arrivent pendant l'exécution du programme sont hors de sa portée.

### D'où viennent les données non fiables

Un backend typique reçoit des données de nombreuses sources qu'il ne contrôle pas :

1. **Les requêtes HTTP**

   Corps de requête, query strings, paramètres de route et en-têtes sont écrits par le client, ou par quiconque appelle l'API.

2. **Les variables d'environnement**

   Ce sont toujours des chaînes, elles peuvent manquer, et elles changent d'une machine à l'autre.

3. **Les services externes**

   Une API tierce peut changer le format de sa réponse, renvoyer une page d'erreur au lieu de JSON, ou envoyer `null` là où une valeur était attendue.

4. **Les données stockées et générées**

   Fichiers JSON, files de messages, webhooks et sorties de modèles de langage arrivent tous comme des valeurs non vérifiées.

Prenons ce handler de route :

```typescript
type CreateUser = {
    email: string;
    age: number;
};

app.post('/users', async (req, res) => {
    const user: CreateUser = req.body;

    // TypeScript est satisfait, mais rien n'a été vérifié.
    await db.users.insert(user);
});
```

L'annotation dit au compilateur que `req.body` est un `CreateUser`. Elle n'en fait pas un. Si un client envoie `{ "email": 42 }`, la valeur arrive telle quelle dans la base.

### Types et validation à l'exécution

| Critère | Types TypeScript | Validation à l'exécution |
| --- | --- | --- |
| Quand | À la compilation | Pendant l'exécution de l'application |
| Vérifie | Votre propre code | Les données que reçoit votre code |
| Présent en production | Non, les types sont effacés | Oui |
| Protège contre | Les erreurs de programmation | Les entrées malformées, manquantes ou malveillantes |

Les deux sont nécessaires. Les types protègent le code contre lui-même, la validation le protège contre le monde extérieur.

La réponse habituelle consiste à écrire une fonction de validation à côté de chaque type. Cela fonctionne, mais crée deux descriptions des mêmes données qu'il faut synchroniser à la main. Quand l'une change et pas l'autre, le type se met à mentir.

## Qu'est-ce que Zod ?

Zod est une bibliothèque de validation de schémas pensée pour TypeScript. Au lieu d'écrire séparément un type et une fonction de validation, nous décrivons une seule fois la forme attendue des données, dans un **schéma**.

À partir de ce schéma, Zod fournit deux choses :

- **La validation à l'exécution** : le schéma vérifie les vraies valeurs pendant que l'application tourne.
- **Les types statiques** : le type TypeScript est déduit du schéma avec `z.infer`.

Le schéma devient l'unique source de vérité sur la forme des données.

### Définir un schéma

```typescript
import { z } from 'zod';

const CreateUser = z.object({
    email: z.email(),
    name: z.string().trim().min(2).max(80),
    age: z.number().int().min(18),
});

type CreateUser = z.infer<typeof CreateUser>;
// { email: string; name: string; age: number }
```

Le type n'est jamais écrit à la main. Si un champ est ajouté au schéma, le type suit automatiquement.

### Analyser les données

Zod propose deux façons principales de vérifier une valeur.

#### parse()

`parse()` renvoie la donnée validée, ou lève une `ZodError` quand la valeur ne correspond pas :

```typescript
const user = CreateUser.parse(req.body);
// user est maintenant un CreateUser, vérifié à l'exécution
```

#### safeParse()

`safeParse()` ne lève jamais d'exception. Il renvoie un objet qui indique si la validation a réussi :

```typescript
const result = CreateUser.safeParse(req.body);

if (!result.success) {
    console.log(result.error.issues);
} else {
    console.log(result.data);
}
```

`safeParse()` est en général le meilleur choix dans un handler de requête, où une entrée invalide est attendue et doit mener à une réponse d'erreur claire plutôt qu'à une exception.

Notez que Zod **analyse** les données, il ne se contente pas de les vérifier. La valeur renvoyée est un nouvel objet : les transformations comme `.trim()` ont été appliquées, et les valeurs par défaut ont été remplies.

### Ce qui a changé avec Zod 4

Zod 4 est la version majeure actuelle. Quelques changements sont utiles à connaître avant de lire des tutoriels plus anciens :

- Les formats de chaîne sont des fonctions de premier niveau : `z.email()`, `z.url()`, `z.uuid()` au lieu de `z.string().email()`.
- `z.strictObject()` et `z.looseObject()` rendent explicite le traitement des clés inconnues.
- `z.toJSONSchema()` convertit un schéma en JSON Schema sans paquet supplémentaire.
- `zod/mini` propose une API plus légère, compatible avec le tree-shaking, pour le navigateur et l'edge.

## Zod et ses alternatives

Zod n'est pas la seule bibliothèque de validation de l'écosystème TypeScript.

| Bibliothèque | Approche | Idéale pour |
| --- | --- | --- |
| Zod | API de schémas chaînée, inférence de types | La validation en général, le plus large écosystème |
| Valibot | Petites fonctions composables | Le poids du bundle : code navigateur et edge |
| ArkType | Syntaxe proche des types TypeScript | Les équipes qui veulent des schémas lisibles comme des types |
| Yup | API de schémas chaînée | Les projets existants, surtout avec Formik |
| Joi | API de schémas chaînée, pensée pour JavaScript | Les projets Node.js existants sans TypeScript |

Zod, Valibot et ArkType implémentent tous **Standard Schema**, une interface commune qui permet aux frameworks d'accepter n'importe lequel des trois. Passer de l'un à l'autre est plus simple qu'avant.

La force principale de Zod reste son écosystème : les validateurs de requêtes pour Hono, Express et tRPC, les bibliothèques de formulaires comme React Hook Form, et les sorties structurées des modèles de langage le prennent tous en charge directement.

## Les trois règles de la validation avec Zod

Ajouter Zod à un projet ne le rend pas sûr à lui seul. La validation ne protège une API que si elle est appliquée au bon endroit et de la bonne façon.

### Règle 1 : valider à la frontière, puis faire confiance

La validation se fait là où les données **entrent** dans l'application : le handler de requête, le chargement de la configuration, le client qui appelle une API externe.

Une fois qu'une valeur est passée par un schéma, le reste du code peut se fier à son type. Les services, les repositories et les fonctions utilitaires n'ont pas besoin de la vérifier à nouveau.

Mauvais :

```typescript
// Le service reçoit des données non vérifiées et se défend partout.
function createUser(input: any) {
    if (typeof input.email !== 'string') {
        throw new Error('Invalid email');
    }
    // ...
}
```

Bon :

```typescript
// Le handler valide une fois, le service reçoit une valeur typée.
const user = CreateUser.parse(req.body);

await createUser(user);

function createUser(user: CreateUser) {
    // user.email est ici une adresse email valide
}
```

Valider à la frontière garde les vérifications à un seul endroit et rend vrais les types à l'intérieur de l'application.

### Règle 2 : refuser les champs inconnus

Par défaut, `z.object()` **retire** les clés qui ne font pas partie du schéma :

```typescript
const Profile = z.object({ name: z.string() });

Profile.parse({ name: 'Joel', isAdmin: true });
// { name: 'Joel' }
```

Ce retrait est sûr pour les données stockées, mais il cache les erreurs. Un client qui envoie `emial` au lieu de `email`, ou un champ que l'API ne gère pas, ne reçoit aucun retour.

Pour les corps de requête, il vaut souvent mieux refuser les clés inconnues avec `z.strictObject()` :

```typescript
const Profile = z.strictObject({ name: z.string() });

Profile.safeParse({ name: 'Joel', isAdmin: true }).success;
// false : Unrecognized key: "isAdmin"
```

Un schéma strict rend le contrat explicite. L'API accepte exactement les champs qu'elle documente, et tout le reste est une erreur que le client peut corriger.

### Règle 3 : ne jamais renvoyer les erreurs brutes

Une `ZodError` contient le détail de chaque vérification échouée : codes, chemins, et parfois des détails internes comme l'expression régulière utilisée pour valider une adresse email.

Ces informations sont utiles dans les logs, mais ne doivent pas être envoyées telles quelles aux clients. Une réponse d'erreur fait partie de l'API : elle doit être stable, lisible et sans détails d'implémentation.

Zod fournit des fonctions pour transformer une erreur en structure propre :

```typescript
const result = CreateUser.safeParse(input);

if (!result.success) {
    z.flattenError(result.error);
}
```

Exemple de sortie :

```json
{
  "formErrors": ["Unrecognized key: \"isAdmin\""],
  "fieldErrors": {
    "email": ["Invalid email address"],
    "age": ["Too small: expected number to be >=18"]
  }
}
```

`formErrors` contient les erreurs qui concernent l'objet entier, et `fieldErrors` une liste de messages par champ. Pour les logs et les outils en ligne de commande, `z.prettifyError()` produit plutôt une chaîne lisible.

Ces trois règles transforment la validation, d'une formalité, en un vrai contrat entre l'API et ses clients.

## Implémentation en Node.js

Nous allons maintenant construire trois éléments sur les mêmes schémas :

- La validation des requêtes dans une route HTTP
- Les variables d'environnement vérifiées au démarrage
- Un JSON Schema généré pour la documentation

Les exemples utilisent **Hono**, un petit framework web qui tourne sur Node.js et sur les runtimes edge. Les mêmes idées s'appliquent à Express, comme le montre la fin de l'étape 3.

### Étape 1 : installer les dépendances

```bash
npm install zod hono @hono/zod-validator
```

`@hono/zod-validator` est le middleware officiel qui relie les schémas Zod aux routes Hono.

### Étape 2 : définir le schéma de la requête

Créez un module qui regroupe les schémas de l'API :

```typescript
// schemas.ts

import { z } from 'zod';

export const CreateUser = z.strictObject({
    email: z.email(),
    name: z.string().trim().min(2).max(80),
    age: z.number().int().min(18),
    role: z.enum(['admin', 'member']).default('member'),
});

export type CreateUser = z.infer<typeof CreateUser>;
```

Ce schéma :

- Exige une adresse email valide
- Retire les espaces autour du nom, puis vérifie sa longueur
- Exige un âge entier d'au moins 18 ans
- N'accepte que deux rôles, et utilise `member` quand aucun n'est envoyé
- Refuse tout autre champ

### Étape 3 : valider la requête

```typescript
// app.ts

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { CreateUser } from './schemas';

const app = new Hono();


app.post(
    '/users',
    zValidator('json', CreateUser, (result, c) => {
        if (!result.success) {
            return c.json(
                {
                    error: 'Invalid request body',
                    details: z.flattenError(result.error)
                },
                400
            );
        }
    }),
    async (c) => {
        const user = c.req.valid('json');
        // user: { email: string; name: string; age: number; role: 'admin' | 'member' }

        return c.json({ email: user.email, role: user.role }, 201);
    }
);


export default app;
```

Le troisième argument de `zValidator` est un hook exécuté après la validation. Sans lui, le middleware répond quand même `400`, mais le corps de la réponse contient la `ZodError` brute. Le hook permet d'appliquer la règle 3 et de renvoyer une erreur propre.

Dans le handler, `c.req.valid('json')` renvoie la valeur analysée avec son type déduit. Le handler ne touche jamais de données non vérifiées.

Avec Express, le même schéma s'utilise avec `safeParse()` :

```typescript
app.post('/users', (req, res) => {
    const result = CreateUser.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: 'Invalid request body',
            details: z.flattenError(result.error)
        });
    }

    const user = result.data;
    // ...
});
```

### Étape 4 : valider les variables d'environnement

La configuration est elle aussi une donnée externe. Une URL de base manquante ou un port mal formé doit arrêter l'application au démarrage, pas la faire planter à la première requête.

```typescript
// env.ts

import { z } from 'zod';

const Env = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.url(),
});


const result = Env.safeParse(process.env);

if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(z.prettifyError(result.error));
    process.exit(1);
}


export const env = result.data;
```

Les variables d'environnement sont toujours des chaînes. `z.coerce.number()` convertit `"8080"` en nombre `8080` avant de le vérifier.

Attention aux booléens : `z.coerce.boolean()` suit les règles de JavaScript, donc la chaîne `"false"` devient `true`. Utilisez plutôt `z.stringbool()`, qui comprend des valeurs comme `"true"`, `"false"`, `"1"` et `"0"`.

Le reste de l'application importe `env` et ne lit jamais `process.env` directement :

```typescript
import { env } from './env';

console.log(`Listening on port ${env.PORT}`);
// env.PORT est un nombre
```

### Étape 5 : générer un JSON Schema pour la documentation

La documentation d'une API décrit souvent les mêmes champs une troisième fois, dans un fichier OpenAPI. Avec Zod 4, la documentation peut être générée depuis le schéma lui-même :

```typescript
import { z } from 'zod';
import { CreateUser } from './schemas';

const jsonSchema = z.toJSONSchema(CreateUser, { io: 'input' });
```

Exemple de sortie, raccourci (Zod écrit aussi le motif de l'email et les bornes de l'entier) :

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "email": { "type": "string", "format": "email" },
    "name": { "type": "string", "minLength": 2, "maxLength": 80 },
    "age": { "type": "integer", "minimum": 18 },
    "role": {
      "type": "string",
      "enum": ["admin", "member"],
      "default": "member"
    }
  },
  "required": ["email", "name", "age"],
  "additionalProperties": false
}
```

L'option `io: 'input'` décrit ce que le client doit **envoyer**. Comme `role` a une valeur par défaut, il est facultatif pour le client et n'apparaît pas dans `required`. L'objet strict devient `"additionalProperties": false`.

Ce JSON Schema peut être placé directement dans le `requestBody` d'un document OpenAPI. La documentation ne peut plus s'éloigner de la validation, puisque les deux viennent du même schéma.

### Comment fonctionne l'implémentation

#### Le parcours d'une requête

Quand une requête atteint `POST /users` :

1. Hono lit le corps JSON.
2. `zValidator` l'analyse avec le schéma `CreateUser`.
3. Si l'analyse échoue, le hook renvoie une réponse `400` avec une erreur aplatie.
4. Si elle réussit, le handler reçoit la valeur analysée : nettoyée, complétée par les valeurs par défaut, et typée.

#### Un schéma, trois usages

Le schéma `CreateUser` fournit maintenant :

- La **validation à l'exécution** de chaque requête
- Le **type TypeScript** utilisé par le reste du code
- Le **JSON Schema** utilisé par la documentation

Changer une règle dans le schéma met les trois à jour en même temps.

## Conclusion

TypeScript rend une base de code plus sûre, mais ses garanties s'arrêtent aux bords de l'application. Les corps de requête, les variables d'environnement et les réponses externes arrivent à l'exécution, là où les types n'existent plus.

En validant ces données avec des schémas, une application peut de nouveau se fier à ses types, et refuser les mauvaises entrées avant qu'elles n'atteignent la logique métier ou la base de données.

Dans cet article, nous avons exploré la différence entre les types à la compilation et la validation à l'exécution, les idées principales de Zod, et sa place face à Valibot, ArkType, Yup et Joi. Nous avons ensuite construit la validation des requêtes, la vérification de l'environnement et une documentation générée à partir d'un seul schéma.

L'implémentation respecte les règles essentielles de la validation des entrées :

- Valider les données une seule fois, là où elles entrent dans l'application
- Refuser les champs inconnus au lieu de les ignorer en silence
- Renvoyer des erreurs propres et stables plutôt que la sortie brute de la validation
- Garder un seul schéma comme source de vérité pour la validation, les types et la documentation

La validation n'est toutefois qu'une couche d'une API sûre. L'authentification, les autorisations, la limitation de débit et une gestion soignée des erreurs restent nécessaires.

Le but de la validation n'est pas seulement de refuser les mauvaises données. Il est de garantir que chaque valeur à l'intérieur de l'application est exactement ce que le code croit qu'elle est.

Écrire le schéma d'abord, et laisser les types et la documentation en découler, donne des API plus fiables, plus faciles à faire évoluer et plus difficiles à casser.
