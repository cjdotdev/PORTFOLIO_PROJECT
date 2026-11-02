---
title: "Implémenter le chiffrement au repos AES-256-GCM en Node.js"
subtitle: "TLS cesse de protéger vos données dès qu'elles atteignent la base. Voici comment chiffrer vous-même les champs sensibles, avec le module crypto natif de Node."
date: 2026-07-15
tags: ["Sécurité"]
cover: ./cover.webp
coverAlt: "Un message « Hello! » est verrouillé par une clé en caractères brouillés, puis déverrouillé par la même clé en « Hello! »"
draft: false
---

Les applications web modernes s'appuient largement sur TLS (HTTPS) pour protéger les données pendant leur trajet entre clients et serveurs. Mais cette protection s'arrête dès que les données atteignent l'application. Si des informations sensibles sont stockées sans protection supplémentaire, une compromission de la base de données peut les exposer en clair.

Le chiffrement au niveau de l'application répond à ce problème en chiffrant les données sensibles avant qu'elles ne soient écrites sur le stockage persistant. Au lieu de valeurs en clair, la base stocke des données chiffrées que seule l'application, avec la bonne clé de chiffrement, peut retrouver.

Dans cet article, nous allons explorer les principes du chiffrement au repos et implémenter un système de chiffrement sûr au niveau de l'application en Node.js, avec le module natif `crypto`. Nous verrons les notions cryptographiques en jeu, les règles indispensables à un chiffrement sûr, puis nous construirons des utilitaires réutilisables de chiffrement et de déchiffrement pour protéger les enregistrements d'une base de données.

## Comprendre le chiffrement au repos

Le **chiffrement au repos** consiste à protéger les données stockées en les rendant illisibles avant leur écriture sur le stockage persistant. Il s'applique aux bases de données, aux systèmes de fichiers, aux sauvegardes et au stockage objet.

Le chiffrement au repos est différent du chiffrement en transit. TLS protège l'information pendant qu'elle circule sur le réseau, mais ne protège plus les données une fois qu'elles ont atteint l'application et la base.

### Le modèle de menace

Une application backend typique traite les données en plusieurs étapes :

1. **Client → Application**

   Les données sont transmises de façon sûre avec TLS (HTTPS).

2. **Traitement par l'application**

   L'application reçoit et traite les données en clair.

3. **Stockage en base**

   Les données sont stockées. Sans chiffrement supplémentaire, les valeurs sensibles restent lisibles.

La faille se situe au niveau du stockage. Si un attaquant accède à la base, par des identifiants volés, une injection SQL, des sauvegardes exposées ou de mauvaises permissions, les informations stockées peuvent être lisibles immédiatement.

TLS ne peut pas protéger des données qui sont déjà stockées.

### Chiffrement en transit et chiffrement au repos

| Critère | Chiffrement en transit | Chiffrement au repos |
| --- | --- | --- |
| Objectif | Protéger les données qui circulent entre systèmes | Protéger les données stockées |
| Exemple | HTTPS/TLS | Champs chiffrés en base |
| Protège contre | L'interception sur le réseau | La compromission de la base et l'exposition du stockage |
| Appliqué par | L'infrastructure et le réseau | La base de données ou l'application |

Les deux formes de chiffrement comptent. TLS protège les données pendant leur trajet, le chiffrement au repos les protège une fois stockées.

### Choisir la bonne approche de chiffrement

Avant d'implémenter le chiffrement en Node.js, il faut comprendre les grandes familles d'algorithmes cryptographiques et savoir où utiliser chacune.

## Chiffrement symétrique et asymétrique

La cryptographie moderne se divise en deux grandes familles : le **chiffrement symétrique** et le **chiffrement asymétrique**.

Les deux apportent de la sécurité, mais ne résolvent pas les mêmes problèmes.

### Le chiffrement symétrique

Le chiffrement symétrique utilise une seule clé secrète pour chiffrer et pour déchiffrer.

La clé qui transforme le texte en clair en texte chiffré est la même que celle qui permet de retrouver les données d'origine.

#### Avantages

- Très rapide et efficace
- Adapté au chiffrement de grandes quantités de données
- Idéal pour protéger les données stockées par une application

#### Difficulté

La principale difficulté est de protéger la clé de chiffrement. Quiconque l'obtient peut déchiffrer les données protégées.

Algorithmes symétriques courants :

- AES (Advanced Encryption Standard)
- ChaCha20

### Le chiffrement asymétrique

Le chiffrement asymétrique utilise une paire de clés :

- Une clé publique, qui peut être partagée
- Une clé privée, qui doit rester secrète

Les données chiffrées avec la clé publique ne peuvent être déchiffrées qu'avec la clé privée correspondante.

#### Avantages

- Permet un échange de clés sûr
- Permet les signatures numériques
- Évite d'avoir à partager une clé secrète

#### Limites

- Bien plus lent que le chiffrement symétrique
- Inadapté au chiffrement de grandes quantités de données applicatives

Algorithmes asymétriques courants :

- RSA
- La cryptographie sur courbes elliptiques (ECC)
- Ed25519

### Quelle approche pour chiffrer une base de données ?

Pour chiffrer des enregistrements en base, le chiffrement symétrique est le bon choix.

Une application backend écrit et lit généralement ses propres données. Elle n'a pas besoin d'échanger des clés avec un tiers, ce qui rend la rapidité et la simplicité du chiffrement symétrique plus adaptées.

Le chiffrement asymétrique reste indispensable ailleurs en sécurité : l'authentification, les signatures numériques et l'échange de clés.

Pour protéger les données stockées par une application, il nous faut un algorithme symétrique rapide, aux garanties de sécurité solides.

## Qu'est-ce qu'AES-256-GCM ?

AES-256-GCM réunit trois notions cryptographiques :

- **AES (Advanced Encryption Standard)** : l'algorithme de chiffrement
- **256** : la taille de la clé de chiffrement
- **GCM (Galois/Counter Mode)** : le mode qui assure le chiffrement et la vérification d'intégrité

Ensemble, ils forment un système moderne de chiffrement authentifié, adapté à la protection des données sensibles d'une application.

### AES

AES est un chiffrement par blocs symétrique, standardisé par le NIST et largement adopté par les systèmes modernes.

Il accepte trois tailles de clé :

- 128 bits
- 192 bits
- 256 bits

AES est considéré comme sûr parce qu'il a été longuement analysé, qu'il est implémenté efficacement et qu'il est déployé partout : systèmes d'exploitation, fournisseurs cloud et normes de sécurité.

### Pourquoi AES-256 ?

Le « 256 » d'AES-256 désigne la taille de la clé.

Une clé de 256 bits offre un nombre de combinaisons si grand qu'une attaque par force brute est impossible en pratique.

AES-128 reste considéré comme sûr, mais AES-256 offre une marge de sécurité plus large et il est souvent choisi pour protéger les informations les plus sensibles.

### Comprendre GCM

AES ne définit que l'algorithme de chiffrement. Un mode opératoire détermine comment AES s'applique à des données plus volumineuses.

GCM (Galois/Counter Mode) est un mode moderne qui fournit du **chiffrement authentifié avec données associées (AEAD)**.

Il apporte deux propriétés de sécurité importantes :

#### Confidentialité

Les données d'origine sont chiffrées et ne peuvent pas être lues sans la clé de chiffrement.

#### Intégrité

Toute modification des données chiffrées est détectée au déchiffrement.

AES-GCM produit trois valeurs importantes :

- Le texte chiffré
- Le nonce (IV)
- Le tag d'authentification

Le tag d'authentification permet à l'application de vérifier que les données chiffrées n'ont pas été modifiées. Si le texte chiffré, le nonce ou la clé sont incorrects, le déchiffrement échoue au lieu de renvoyer des données invalides.

Les bases d'AES-256-GCM posées, voyons les règles à respecter pour l'utiliser de façon sûre.

## Les trois règles essentielles d'AES-GCM

AES-256-GCM offre de solides garanties de sécurité, mais seulement s'il est correctement implémenté. La plupart des vulnérabilités d'AES-GCM ne viennent pas d'une faiblesse de l'algorithme lui-même, mais d'une mauvaise utilisation.

Trois règles sont indispensables pour préserver les propriétés de sécurité d'AES-GCM.

### Règle 1 : ne jamais réutiliser un nonce avec la même clé

Un **nonce** (Number Used Once, un nombre utilisé une seule fois), aussi appelé vecteur d'initialisation (IV), est une valeur unique utilisée lors du chiffrement.

Avec AES-GCM, chaque opération de chiffrement faite avec la même clé doit utiliser un nonce différent.

GCM se sert du nonce pour générer le flux de chiffrement. Réutiliser le même nonce avec la même clé fait réutiliser le même état interne, ce qui peut révéler des informations sur le texte en clair et compromettre le mécanisme d'authentification.

La réutilisation d'un nonce peut entraîner :

- Une perte de confidentialité
- L'exposition de liens entre messages chiffrés
- La possibilité de forger des tags d'authentification valides

La bonne approche consiste à générer un nouveau nonce aléatoire à chaque opération de chiffrement :

```javascript
const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    key,
    iv
);
```

AES-GCM est optimisé pour des **nonces de 96 bits (12 octets)**, la taille recommandée pour la plupart des applications.

Le nonce n'a pas besoin d'être secret. Il doit simplement être unique, et stocké avec les données chiffrées pour pouvoir être fourni au déchiffrement.

Exemple de format de stockage :

```json
{
  "iv": "...",
  "tag": "...",
  "data": "..."
}
```

### Règle 2 : toujours vérifier le tag d'authentification

AES-GCM est un algorithme de chiffrement authentifié. Il ne se contente pas de chiffrer : il vérifie aussi que les données chiffrées n'ont pas été modifiées.

Au chiffrement, GCM génère un **tag d'authentification**.

Au déchiffrement, ce tag doit être fourni et vérifié avant que le texte en clair ne soit renvoyé.

En Node.js :

```javascript
decipher.setAuthTag(authTag);

const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final()
]);
```

Si le texte chiffré a été modifié, si la mauvaise clé est utilisée ou si le tag ne correspond pas, `decipher.final()` lève une erreur.

Un déchiffrement réussi doit toujours signifier :

- Que la clé est correcte
- Que le nonce est correct
- Que le texte chiffré est intact
- Que le tag d'authentification est valide

N'ignorez jamais un échec d'authentification et ne renvoyez jamais des données partiellement déchiffrées.

### Règle 3 : protéger la clé de chiffrement

La clé de chiffrement est l'élément le plus sensible de tout le système.

AES-256-GCM ne protège les données que si la clé reste secrète. Un attaquant qui obtient la clé peut déchiffrer toutes les données qu'elle protège.

Les clés fuient souvent par accident, notamment en :

- Les écrivant en dur dans le code source
- Les committant dans le gestionnaire de versions
- Journalisant des valeurs de configuration sensibles
- Les stockant dans des fichiers non protégés
- Exposant les secrets de production à des personnes qui n'en ont pas besoin

#### Bonnes pratiques de gestion des clés

**Ne jamais écrire une clé en dur.** Une clé de chiffrement ne doit jamais apparaître directement dans le code de l'application.

À éviter :

```javascript
const key = "a1b2c3d4...";
```

**Utiliser des variables d'environnement en développement.** Exemple :

```dotenv
AES_256_KEY=your_secret_key_here
```

Assurez-vous que les fichiers d'environnement sont exclus du gestionnaire de versions.

**Utiliser un gestionnaire de secrets en production.** Les systèmes en production doivent passer par une solution dédiée au stockage des secrets, par exemple :

- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault

**Restreindre l'accès.** Seuls les services et les personnes qui en ont besoin doivent pouvoir récupérer la clé de chiffrement.

**Prévoir la rotation des clés.** Un système en production doit pouvoir remplacer ses clés sans perdre l'accès aux données déjà chiffrées.

Exemple de chargement de la clé :

```javascript
const secretKeyHex = process.env.AES_256_KEY;

if (!secretKeyHex) {
    throw new Error('AES_256_KEY is missing');
}

if (secretKeyHex.length !== 64) {
    throw new Error('AES_256_KEY must contain 32 bytes');
}

const key = Buffer.from(secretKeyHex, 'hex');
```

En respectant ces trois règles, AES-256-GCM apporte les garanties de sécurité pour lesquelles il a été conçu.

## Implémentation en Node.js

Node.js inclut un module `crypto` qui prend en charge AES-256-GCM nativement.

Aucune dépendance externe n'est nécessaire.

Avant d'implémenter le chiffrement, rappelez-vous qu'AES-GCM produit trois valeurs à stocker ensemble :

- **Le texte chiffré** : les données chiffrées
- **Le nonce (IV)** : nécessaire au déchiffrement
- **Le tag d'authentification** : vérifie l'intégrité des données

La base de données n'a pas besoin de comprendre ces valeurs. Elle doit seulement les stocker pour que l'application puisse déchiffrer les données plus tard.

### Étape 1 : générer une clé de chiffrement

AES-256 exige une clé de 256 bits (32 octets).

La clé doit être générée par un générateur aléatoire cryptographiquement sûr.

Générer une clé :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Exemple de sortie :

```plaintext
8f3a9b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1
```

Stockez la clé de façon sûre :

```dotenv
AES_256_KEY=your_generated_key_here
```

Ne committez jamais cette valeur dans le gestionnaire de versions.

### Étape 2 : créer l'utilitaire de chiffrement

Créez un module de chiffrement réutilisable :

```javascript
// crypto.js

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

const KEY_HEX = process.env.AES_256_KEY;

if (!KEY_HEX || KEY_HEX.length !== 64) {
    throw new Error(
        'AES_256_KEY must be a 64-character hexadecimal string'
    );
}

const KEY = Buffer.from(KEY_HEX, 'hex');


function encrypt(value) {
    if (value === null || value === undefined) {
        return null;
    }

    const plaintext = JSON.stringify(value);

    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(
        ALGORITHM,
        KEY,
        iv
    );

    const ciphertext = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
    ]);

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
        iv: iv.toString('hex'),
        tag: authTag.toString('hex'),
        data: ciphertext.toString('hex')
    });
}


function decrypt(payload) {
    if (!payload) {
        return null;
    }

    const {
        iv,
        tag,
        data
    } = JSON.parse(payload);


    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        KEY,
        Buffer.from(iv, 'hex')
    );


    decipher.setAuthTag(
        Buffer.from(tag, 'hex')
    );


    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(data, 'hex')),
        decipher.final()
    ]);


    return JSON.parse(
        plaintext.toString('utf8')
    );
}


module.exports = {
    encrypt,
    decrypt
};
```

### Comment fonctionne l'implémentation

#### Le chiffrement

Le chiffrement suit ces étapes :

1. Générer un nonce unique :

   ```javascript
   crypto.randomBytes(12)
   ```

2. Créer un chiffreur AES-256-GCM avec la clé de chiffrement.
3. Chiffrer le texte en clair.
4. Extraire le tag d'authentification.
5. Stocker ensemble le nonce, le tag et le texte chiffré.

#### Le déchiffrement

Le déchiffrement inverse l'opération :

1. Lire la charge chiffrée stockée.
2. En extraire le nonce, le tag d'authentification et le texte chiffré.
3. Initialiser AES-GCM avec la même clé et le même nonce.
4. Fournir le tag d'authentification.
5. Déchiffrer le texte chiffré.

Si une valeur a été modifiée, l'authentification échoue et le déchiffrement s'arrête.

### Format de stockage en base

Les valeurs chiffrées peuvent être stockées sous forme de chaîne JSON :

```json
{
  "iv": "a1b2c3d4e5f6789012345678",
  "tag": "f9e8d7c6b5a43210fedcba9876543210",
  "data": "8a7b6c5d4e3f20112233445566778899"
}
```

Une simple colonne de type texte suffit :

- PostgreSQL : `TEXT`
- MySQL : `TEXT` ou `VARCHAR`
- MongoDB : `String`

Une limite importante du chiffrement au niveau de l'application : les champs chiffrés ne peuvent pas être interrogés normalement. Rechercher, trier ou indexer des valeurs chiffrées demande des choix de conception supplémentaires.

## Conclusion

Le chiffrement au repos est un élément essentiel de la protection des données sensibles dans les applications backend modernes. TLS protège l'information pendant qu'elle circule entre systèmes, mais plus une fois qu'elle a atteint l'application et la base.

En chiffrant les valeurs sensibles avant de les stocker, une application réduit l'impact d'une fuite de base de données ou d'un accès non autorisé.

Dans cet article, nous avons exploré les fondements du chiffrement au repos, les différences entre chiffrement symétrique et asymétrique, et les principes d'AES-256-GCM. Nous avons ensuite implémenté une couche de chiffrement réutilisable en Node.js avec le module natif `crypto`.

L'implémentation respecte les exigences essentielles d'un usage sûr d'AES-GCM :

- Utiliser un chiffrement authentifié
- Générer un nonce unique à chaque opération de chiffrement
- Garder les clés de chiffrement hors du code de l'application
- Vérifier le tag d'authentification avant d'accepter des données déchiffrées

Le chiffrement n'est toutefois qu'une couche d'une stratégie de sécurité complète. Un système sûr demande aussi des contrôles d'accès, de l'audit, de la supervision et une démarche claire face à une éventuelle compromission.

Le but du chiffrement n'est pas seulement de rendre les données illisibles. Il est de garantir que les informations sensibles restent protégées même quand les autres couches de sécurité cèdent.

Intégrer le chiffrement à votre architecture dès le départ donne des systèmes plus résilients, plus fiables et mieux préparés aux menaces réelles.
