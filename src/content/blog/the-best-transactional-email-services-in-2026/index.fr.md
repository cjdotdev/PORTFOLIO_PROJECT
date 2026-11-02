---
title: "Les meilleurs services d'email transactionnel en 2026"
subtitle: "Réinitialisations de mot de passe, reçus et codes de connexion doivent arriver. Voici sept façons de les envoyer depuis votre application, à commencer par celle qui garde vos données et votre fournisseur entre vos mains."
date: 2026-10-23
tags: ["Outils"]
cover: ./cover.webp
coverAlt: "Le logo de MakiSend au centre, relié par des pointillés aux logos de Resend, SendGrid, Mailgun, Postmark, Amazon SES et Brevo"
draft: false
---

Presque toutes les applications envoient des emails. Un utilisateur s'inscrit et doit confirmer son adresse. Quelqu'un oublie son mot de passe. Un client paie et attend son reçu. Ces messages ne sont pas du marketing : ils font partie du produit, et s'ils n'arrivent pas, le produit semble cassé.

Les envoyer vous-même, depuis votre propre serveur mail, est rarement une bonne idée. Délivrabilité, nouvelles tentatives, logs et sécurité deviennent vite un projet à part entière. C'est pourquoi la plupart des équipes s'appuient sur un service d'email transactionnel.

Dans cet article, nous verrons ce qui fait un bon service d'email transactionnel, puis nous comparerons sept options : MakiSend, Resend, Postmark, Amazon SES, SendGrid, Mailgun et Brevo. En toute transparence : j'ai construit MakiSend, il passe donc en premier. Je resterai tout de même honnête sur les points forts de chaque outil, MakiSend compris.

## Qu'est-ce qu'un email transactionnel ?

Un **email transactionnel** est un message envoyé automatiquement à une personne, en réponse à une action de cette personne.

Exemples courants :

- La confirmation de compte et la vérification d'adresse
- Les liens de réinitialisation de mot de passe
- Les codes de connexion et l'authentification à deux facteurs
- Les reçus, factures et confirmations de commande
- Les notifications sur l'activité du compte

### Email transactionnel et email marketing

| Critère | Email transactionnel | Email marketing |
| --- | --- | --- |
| Déclencheur | Une action de l'utilisateur | Une campagne décidée par l'entreprise |
| Destinataires | Une personne | Une liste de contacts |
| Attendu par l'utilisateur | Oui, souvent tout de suite | Pas forcément |
| Consentement | Fait partie du service | Exige un opt-in dans la plupart des pays |

Les emails transactionnels sont attendus, et souvent urgents. Un code de connexion qui arrive dix minutes trop tard, c'est une connexion ratée.

## Ce qu'il faut regarder

Avant de comparer les services, il faut savoir ce qui compte pour ce type d'email.

### La délivrabilité

L'email doit atteindre la boîte de réception, pas les spams. Cela dépend de l'infrastructure d'envoi, de sa réputation, et d'une bonne configuration de SPF, DKIM et DMARC sur votre domaine.

### Une API simple

Envoyer un email devrait tenir en une requête HTTP, avec des erreurs claires quand quelque chose ne va pas.

### La fiabilité

Un fournisseur peut être lent ou indisponible un moment. Une bonne installation réessaie automatiquement au lieu de perdre le message.

### La visibilité

Quand un utilisateur dit « je n'ai jamais reçu l'email », il vous faut des logs qui montrent ce qui s'est passé, conservés assez longtemps pour vérifier.

### La confidentialité des données

Les emails transactionnels contiennent des informations sensibles : adresses, noms, liens de réinitialisation, parfois des factures. L'endroit où ces données sont stockées, et sous quelle forme, compte.

### Le prix

La plupart des services facturent à l'email ou au volume mensuel. Pour un petit projet, c'est souvent l'offre gratuite qui décide.

## Les sept meilleurs services d'email transactionnel

### 1. MakiSend

[MakiSend](https://makisend.lixalistudio.tech) est une API d'email auto-hébergée et serverless qui tourne sur **Cloudflare Workers**. Votre application envoie une requête authentifiée ; MakiSend chiffre le message et le met en file d'attente, puis le livre via **votre propre fournisseur SMTP**, avec des nouvelles tentatives automatiques et un dashboard qui montre chaque envoi.

Son approche diffère de celle des autres services de cette liste. Au lieu de remplacer votre fournisseur d'email, MakiSend se place devant lui : vous gardez votre fournisseur, votre domaine d'envoi et votre réputation, et vous obtenez une seule API, un seul dashboard et les mêmes garanties, quel que soit le fournisseur derrière.

#### Pourquoi choisir MakiSend

- **Aucun serveur à gérer.** Un seul Worker sert l'API et le dashboard. Cloudflare Queues et Workflows s'occupent de la livraison.
- **Votre propre SMTP.** Zoho, Gmail, Microsoft 365, Resend, SendGrid, Mailgun ou Cloudflare Email Service. Changer de fournisseur ne change pas votre code.
- **Une livraison fiable.** L'API répond `202` tout de suite, puis un workflow durable envoie l'email, avec un nombre limité de nouvelles tentatives et une dead-letter queue.
- **Privé par défaut.** Destinataires, contenus, pièces jointes et identifiants SMTP sont chiffrés en AES-256-GCM avant d'être stockés.
- **Pensé pour les petites équipes.** Des clés d'API par utilisateur avec quota optionnel, des clés d'idempotence, l'authentification à deux facteurs, et un dashboard avec logs, statistiques et templates.
- **Une API familière.** Les pièces jointes suivent le même format que Resend : un client écrit pour Resend envoie le même JSON.

#### Envoyer un email

```bash
curl -X POST https://your-instance.workers.dev/send-email \
  -H "Authorization: Bearer mk_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-1042-receipt" \
  -d '{
    "to": "customer@example.com",
    "subject": "Your receipt",
    "text": "Thank you for your order #1042.",
    "html": "<p>Thank you for your order <strong>#1042</strong>.</p>"
  }'
```

Réponse :

```json
{
  "success": true,
  "message": "Email queued",
  "emailId": "..."
}
```

L'en-tête `Idempotency-Key` permet de renvoyer la requête sans risque : envoyer deux fois la même clé renvoie l'email d'origine au lieu d'en envoyer un second.

#### Limites

MakiSend est jeune. Les webhooks et le suivi des bounces, ouvertures et clics ne sont pas encore construits, et la délivrabilité dépend du fournisseur SMTP que vous connectez. Les Workers envoient aussi depuis des IP Cloudflare partagées : un fournisseur qui exige une liste d'IP autorisées ne fonctionnera pas.

#### Prix

MakiSend est gratuit. Vous payez à Cloudflare le Worker, D1 et les Queues que vous utilisez, et à votre fournisseur SMTP les emails qu'il envoie. Rien n'est facturé par email en plus.

### 2. Resend

[Resend](https://resend.com) est une API d'email pensée pour les développeurs, avec une interface soignée, des SDK pour la plupart des langages, et une prise en charge native des templates React Email.

**Points forts :** une excellente expérience développeur, une documentation claire, et des webhooks pour les événements de livraison.

**Limites :** les logs sont conservés 30 jours sur toutes les offres sauf Enterprise, et l'offre gratuite est plafonnée à 100 emails par jour.

**Prix :** gratuit jusqu'à 3 000 emails par mois (100 par jour). L'offre Pro commence à 20 $ par mois pour 50 000 emails.

Resend peut aussi servir de fournisseur SMTP derrière MakiSend.

### 3. Postmark

[Postmark](https://postmarkapp.com) se consacre uniquement à l'email transactionnel. Il est connu pour la rapidité de ses envois et pour sa séparation stricte entre trafic transactionnel et envois groupés.

**Points forts :** une solide réputation de délivrabilité, des messages conservés 45 jours, davantage sur les offres supérieures.

**Limites :** l'offre gratuite ne sert qu'aux tests, avec 100 emails par mois, et la première offre payante commence à 10 000 emails.

**Prix :** Basic commence à 15 $ par mois pour 10 000 emails, puis 1,80 $ les 1 000 emails supplémentaires.

### 4. Amazon SES

[Amazon Simple Email Service](https://aws.amazon.com/ses/) est l'option bas niveau : très bon marché à grande échelle, mais dépouillée.

**Points forts :** le prix par email le plus bas de cette liste, et l'échelle d'AWS.

**Limites :** les nouveaux comptes démarrent dans une sandbox et doivent demander l'accès à la production, la console est complexe, et les logs, nouvelles tentatives et templates sont en grande partie à votre charge.

**Prix :** 0,10 $ les 1 000 emails, plus 0,12 $ par Go de pièces jointes. Les nouveaux clients AWS reçoivent des crédits utilisables sur SES.

### 5. SendGrid

[SendGrid](https://sendgrid.com), qui appartient à Twilio, est l'une des plateformes d'email les plus anciennes et les plus utilisées, pour le transactionnel comme pour le marketing.

**Points forts :** une plateforme mature, un large écosystème, et des intégrations presque partout.

**Limites :** il n'y a plus d'offre gratuite permanente, seulement un essai de 60 jours, et l'historique d'activité est conservé 3 jours sur Essentials.

**Prix :** un essai gratuit de 60 jours à 100 emails par jour. Essentials commence à 19,95 $ par mois.

SendGrid peut aussi servir de fournisseur SMTP derrière MakiSend.

### 6. Mailgun

[Mailgun](https://www.mailgun.com) est une API d'email pour les développeurs, avec l'envoi, la réception et la validation d'adresses.

**Points forts :** une API complète, le routage des emails entrants, et une documentation solide.

**Limites :** les logs ne sont conservés qu'un jour sur les offres Free et Basic.

**Prix :** gratuit jusqu'à 100 emails par jour. Basic commence à 15 $ par mois pour 10 000 emails.

Mailgun peut aussi servir de fournisseur SMTP derrière MakiSend.

### 7. Brevo

[Brevo](https://www.brevo.com), anciennement Sendinblue, est une plateforme marketing qui propose aussi l'email transactionnel par API et SMTP.

**Points forts :** une offre gratuite généreuse, l'email transactionnel inclus dans toutes les offres, et les outils marketing au même endroit.

**Limites :** le produit est d'abord pensé pour le marketing, le transactionnel n'y est qu'une fonctionnalité parmi d'autres.

**Prix :** gratuit jusqu'à 300 emails par jour. Les offres payantes sont facturées au volume mensuel.

## Comparatif

Prix publiés par chaque service au moment de l'écriture.

| Service | Offre gratuite | Payant à partir de | Hébergement | Vos données |
| --- | --- | --- | --- | --- |
| **MakiSend** | Gratuit, rien par email | Votre usage Cloudflare et SMTP | Votre compte Cloudflare | Chiffrées en AES-256-GCM, dans votre propre base |
| Resend | 3 000 emails/mois (100/jour) | 20 $/mois | Resend | Sur les serveurs de Resend |
| Postmark | 100 emails/mois | 15 $/mois | Postmark | Sur les serveurs de Postmark |
| Amazon SES | Crédits AWS pour les nouveaux comptes | 0,10 $ les 1 000 emails | AWS | Dans votre compte AWS |
| SendGrid | Essai de 60 jours (100/jour) | 19,95 $/mois | Twilio | Sur les serveurs de Twilio |
| Mailgun | 100 emails/jour | 15 $/mois | Mailgun | Sur les serveurs de Mailgun |
| Brevo | 300 emails/jour | Selon le volume | Brevo | Sur les serveurs de Brevo |

## Comment choisir

**Choisissez MakiSend** si vous voulez maîtriser votre envoi d'emails sans gérer de serveur : vos données restent chiffrées dans votre propre compte Cloudflare, vous gardez le fournisseur SMTP que vous payez déjà, et vous avez nouvelles tentatives, logs, templates et clés d'API sans abonnement mensuel. C'est le choix naturel pour les développeurs indépendants, les petites équipes et tous ceux qui sont déjà sur Cloudflare.

**Choisissez Resend** si vous voulez un service hébergé avec la meilleure expérience développeur, et que vos données chez eux ne vous gênent pas.

**Choisissez Postmark** si la délivrabilité est votre seule préoccupation et que votre volume justifie une offre payante dès le départ.

**Choisissez Amazon SES** si vous envoyez de très gros volumes, vivez déjà dans AWS, et êtes prêt à construire logs et nouvelles tentatives vous-même.

**Choisissez SendGrid, Mailgun ou Brevo** si vous avez aussi besoin de campagnes marketing ou d'emails entrants chez le même fournisseur.

Ces choix ne s'excluent pas. Avec MakiSend, Resend, SendGrid ou Mailgun peuvent être le fournisseur derrière votre API, et passer de l'un à l'autre se fait en changeant les réglages SMTP, pas le code.

## Conclusion

L'email transactionnel paraît simple jusqu'au jour où un lien de réinitialisation se perd. Un bon service doit livrer de façon fiable, réessayer quand un fournisseur tombe, garder des logs assez longtemps pour répondre au support, et protéger les données personnelles que ces messages transportent.

Dans cet article, nous avons vu ce qu'est un email transactionnel, les critères qui comptent dans le choix d'un service, et sept options avec leurs points forts, leurs limites et leurs prix.

Les services hébergés comme Resend, Postmark, SendGrid, Mailgun et Brevo sont rapides à mettre en place, et Amazon SES est difficile à battre sur le prix à grande échelle. MakiSend prend un autre chemin :

- Il tourne sur votre propre compte Cloudflare, sans serveur à gérer
- Vous gardez votre fournisseur SMTP, votre domaine et votre réputation
- Destinataires, contenus et identifiants sont chiffrés avant d'être stockés
- Rien n'est facturé par email

Le meilleur service d'email transactionnel est celui auquel vos utilisateurs ne pensent jamais, parce que chaque email arrive, tout simplement.

Pour essayer MakiSend, le code et le déploiement en un clic sont sur [GitHub](https://github.com/lixalistudio-oss/makisend), et la documentation sur [makisend.lixalistudio.tech](https://makisend.lixalistudio.tech).
