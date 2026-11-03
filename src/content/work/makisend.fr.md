---
subtitle: L'email transactionnel qui tourne sur votre propre compte Cloudflare. Un appel d'API, votre propre fournisseur SMTP, chaque envoi journalisé.
role: Construit chez Lixali Studio. J'en ai écrit l'essentiel, dès la première fonctionnalité.
---

## Le problème

Une application a des emails qu'elle ne peut pas perdre : un reçu, un code de connexion, une
réinitialisation de mot de passe. Il y a d'habitude deux façons de les envoyer. Une API d'email
hébergée garde vos destinataires et le contenu de vos messages, et vous facture à l'email. Un serveur
mail à vous doit être maintenu en vie, mis à jour et surveillé.

MakiSend est une troisième voie. Il tourne sur votre propre compte Cloudflare, sans serveur à
surveiller, et il envoie par le fournisseur SMTP que vous avez déjà (Zoho, Gmail, Microsoft 365,
Resend, SendGrid, Mailgun ou Cloudflare Email Service). Vous gardez votre domaine d'envoi, votre
réputation et vos données.

## Ce qu'il fait

- Un seul appel authentifié, `POST /send-email`, qui répond `202` tout de suite.
- L'envoi en arrière-plan, avec des nouvelles tentatives et une file des échecs (dead-letter queue).
- Un tableau de bord : chaque email et chaque tentative, des statistiques, des modèles, les clés d'API, les réglages SMTP.
- Destinataires, contenus, pièces jointes et mots de passe SMTP chiffrés avant d'être enregistrés.

```bash
curl -X POST https://votre-worker.example.com/send-email \
  -H "Authorization: Bearer mk_..." \
  -H "Idempotency-Key: commande-1042-recu" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ada@example.com",
    "subject": "Votre reçu",
    "text": "Merci pour votre commande 1042.",
    "html": "<p>Merci pour votre commande <b>1042</b>.</p>"
  }'

# 202 Accepted
# { "success": true, "message": "Email queued", "emailId": "..." }
```

## Le trajet d'un email

<figure class="flow">
<ol>
<li><strong>Votre application</strong> appelle <code>POST /send-email</code> avec sa clé d'API.</li>
<li><strong>Le Worker</strong> vérifie la clé, valide le corps avec Zod, chiffre le destinataire et le contenu, et écrit un journal <code>pending</code> dans D1.</li>
<li><strong>La file</strong> ne reçoit que <code>{ emailId }</code>. Votre application a déjà son <code>202</code>.</li>
<li><strong>Un Workflow</strong> démarre pour cet email : il le déchiffre, nettoie le HTML et l'envoie en SMTP. Chaque étape est écrite dans l'historique de l'email.</li>
<li><strong>Votre fournisseur SMTP</strong> accepte le message et le remet dans la boîte de réception.</li>
<li class="aside"><strong>File des échecs</strong> quand l'erreur est définitive (authentification, TLS, DNS, 5xx) ou après le quatrième essai raté.</li>
</ol>
<figcaption>Un seul Worker Cloudflare sert l'API et le tableau de bord. D1 garde les données, Queues et Workflows s'occupent de l'envoi.</figcaption>
</figure>

## Les choix

### Répondre d'abord, envoyer ensuite

SMTP est lent, et l'appelant ne doit pas l'attendre. La requête fait donc le minimum (vérifier,
valider, chiffrer, enregistrer, mettre en file) et répond `202`. L'envoi a lieu juste après, dans un
Workflow Cloudflare : une exécution durable qui survit à un redémarrage et se souvient de l'étape
atteinte. Un échec passager a droit à trois nouveaux essais, à 30 secondes d'intervalle. Un échec
définitif s'arrête tout de suite : aucun nombre d'essais ne corrige un mauvais mot de passe.

### Rien de personnel dans la file

La file transporte un identifiant et rien d'autre. Le destinataire, le contenu et les pièces jointes
restent dans D1, chiffrés en AES-256-GCM avec la Web Crypto API. La clé peut changer sans
interruption : un cron horaire rechiffre ce qui reste sous l'ancienne clé et indique combien il en
reste.

### La clé d'API décide

La clé indique à MakiSend qui envoie et par quelle configuration SMTP. Rien dans le corps de la
requête ne peut choisir l'un ou l'autre. Les corps sont validés par Zod en mode strict : un champ
inattendu est refusé, pas ignoré.

### Ne jamais envoyer deux fois le même email

Un client qui expire va réessayer, et un client ne doit pas recevoir deux reçus. Une requête répétée
avec la même `Idempotency-Key` reçoit la première réponse pendant 24 heures, sans second envoi. La
même clé avec un autre corps est refusée, tout comme une répétition pendant que la première tourne
encore. En dessous, l'identifiant de l'instance du Workflow est celui de l'email : un même email ne
peut pas être lancé deux fois.

### Parler la langue de Resend

Les pièces jointes ont la même forme que dans l'API de Resend. Un client écrit pour Resend envoie le
même JSON à MakiSend, et ça marche.

## Ce qui a été difficile

### SMTP est la partie lente

Une fois en file, un email atteint le fournisseur en 300 à 400 ms au mieux, environ 2 secondes au
pire. L'essentiel de ce temps, c'est SMTP lui-même : chaque commande attend sa réponse (TCP, TLS,
`EHLO`, `AUTH`, `MAIL FROM`, `RCPT TO`, `DATA`), et un Worker ouvre une nouvelle connexion pour chaque
email. Le mesurer m'a montré où ne pas chercher à gagner du temps, et c'est pour cela que l'API répond
avant d'envoyer.

### Impossible d'appeler le service email de Cloudflare

Un Worker ne peut pas ouvrir de connexion SMTP vers Cloudflare Email Service. Pour cet hôte, MakiSend
passe par le binding `send_email` du Worker, pièces jointes comprises, et la vérification de
connexion, l'envoi de test et le contrôle quotidien suivent le même chemin.

### Pas d'adresse IP fixe

Les Workers se connectent depuis des adresses Cloudflare partagées qui changent. Un fournisseur qui
n'accepte que des IP connues les refusera. La solution est du côté du fournisseur (se fier aux
identifiants, pas à l'adresse), et la documentation le dit clairement.

## Testé et livré

Le backend est organisé en contrôleur, service et repository par module, sur Hono et Drizzle. Il a
des tests unitaires, des tests d'intégration dans Miniflare (D1, Queues et Workflows simulés en
local), et un test de bout en bout qui envoie des pièces jointes par les deux entrées et compare ce
qui arrive octet par octet.

Chaque pull request déploie un Worker de prévisualisation avec une base D1 neuve. Un push sur `main`
lance les migrations et déploie. Chacun peut installer sa propre copie en un bouton : il crée la base
et les files sur son compte Cloudflare et ne demande que deux secrets. La première connexion fait du
visiteur l'unique compte de l'instance, et la double authentification est à un réglage près.

## Limites et suite

MakiSend est jeune. Il n'y a pas encore de webhooks, pas de suivi des rebonds, des ouvertures ou des
clics, et un seul fournisseur SMTP par configuration, sans bascule automatique. Les quotas d'envoi par
clé d'API existent mais sont à activer. Ce sont les prochaines pièces.
