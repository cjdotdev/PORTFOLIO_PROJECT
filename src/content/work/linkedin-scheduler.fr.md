---
subtitle: Écrire ses posts LinkedIn à l'avance en fichiers Markdown et laisser cron les publier par l'API officielle de LinkedIn. Sans serveur, sans interface web.
role: Mon propre projet open source, conçu et construit seul.
---

## Le problème

Publier régulièrement sur LinkedIn, c'est être là au bon moment, plusieurs fois par semaine. Je
préfère écrire quand j'ai le temps, dans mon propre éditeur, et laisser les posts partir seuls. Les
outils de planification existent, mais c'est un compte et un abonnement de plus qui gardent mon
token, pour ce qui n'est au fond qu'un dossier de textes et une horloge.

linkedin-scheduler est donc exactement cela : un dossier, deux scripts et une ligne de cron.

## Ce qu'il fait

- Publie un post par passage quand sa date et son heure sont arrivées, avec sa carte image ou sa vidéo.
- Ne publie jamais deux fois le même post, quoi qu'il arrive entre-temps.
- Génère pour chaque post une carte de 1080×1350 à partir d'un modèle HTML, extraits de code colorés.
- Transforme `**l'accroche**` en gras Unicode (LinkedIn n'a pas de mise en forme) et met les liens dans un premier commentaire.
- Vérifie avant d'envoyer : `--check` prouve que le token marche, `--dry-run` montre exactement ce qui partirait.

Un post est un fichier Markdown nommé d'après son jour :

```markdown
---
date: 2026-10-27
time: 09:00
status: ready
card_kicker: TypeScript
card_title: Une règle, *écrite une fois*
card_body: Valider à l'exécution, typer à la compilation, documenter. Avec un seul schéma.
first_comment: La doc : https://example.com
---
**TypeScript vous protège… jusqu'à ce que les données viennent de l'extérieur.**
```

## Le trajet d'un post

<figure class="flow">
<ol>
<li><strong>Un fichier de post</strong> attend dans <code>posts/texts/</code>, daté, avec <code>status: ready</code>.</li>
<li><strong>cron</strong> lance <code>run.sh</code> dans un créneau : 9 h, 9 h 02, 9 h 04, 9 h 06, 9 h 08, et de même à 13 h et 18 h.</li>
<li><strong>publish.py</strong> prend un verrou, trouve le post dû aujourd'hui et le compare au registre.</li>
<li><strong>Le fichier est marqué</strong> <code>publishing</code> avant tout envoi.</li>
<li><strong>L'API de LinkedIn</strong> reçoit la carte ou la vidéo, puis le post, puis le premier commentaire.</li>
<li><strong>Le fichier part</strong> dans <code>posts/posted/</code> avec son lien, et son texte entre dans le registre.</li>
<li class="aside"><strong>Laissé en publishing</strong> quand l'issue est inconnue, pour que je vérifie. Jamais réessayé.</li>
</ol>
<figcaption>Python pour publier, Node et Chrome sans interface pour les cartes. Rien ne tourne entre deux créneaux de cron.</figcaption>
</figure>

## Les choix

### Ne jamais publier deux fois

Publier deux fois le même texte sur un profil public est la seule erreur que cet outil ne doit
jamais faire. Quatre garde-fous l'en empêchent :

- Un verrou (`flock`) empêche deux passages de se chevaucher.
- Le fichier est marqué `publishing` avant la requête : un arrêt en plein milieu laisse une trace visible.
- Chaque texte publié est gardé dans `posts/ledger.json` par son empreinte SHA-256. Le registre vit dans git.
- Un fichier publié quitte la file : il part dans `posts/posted/`.

### Échec certain ou issue inconnue

Toutes les erreurs ne se valent pas. Quand le réseau est coupé ou que LinkedIn refuse le post, rien
n'est parti : le post repasse en `ready` et l'essai suivant du créneau l'envoie. Quand la connexion
tombe après le départ de la requête, LinkedIn a peut-être le post. Réessayer risquerait un doublon :
le fichier reste en `publishing` et le journal me demande de vérifier mon profil.

### Des créneaux, pas une boucle

cron essaie cinq fois par créneau, à deux minutes d'intervalle, et seulement dans les créneaux. Un
post manqué parce que ma machine était éteinte part au créneau suivant du même jour. Un post d'un
jour passé n'est jamais envoyé en retard : un post du lundi publié le mercredi est pire que pas de
post.

### Des cartes en HTML

Les cartes sont un modèle HTML rendu par Chrome sans interface : un libellé, un titre avec des mots
en couleur, un court texte, un logo et un extrait de code facultatifs (colorés avec Shiki), ma
signature. Les couleurs et la signature sont dans `config.toml`. Un texte qui ne tient pas est
refusé, pas coupé.

### L'API officielle uniquement

L'outil publie par l'API de LinkedIn avec un token issu d'une petite application LinkedIn.
Automatiser un compte social par son interface web va contre les conditions des plateformes : il n'y
a donc pas de version Reddit ou X.

## Ce qui a été difficile

### Obtenir un token

LinkedIn ne donne pas de clé d'API toute seule. Il faut créer une application, la rattacher à une
page LinkedIn, ajouter deux produits et générer un token valable environ 60 jours. Le guide
d'installation détaille chaque clic, et le script prévient une semaine avant l'expiration du token.

### Du texte que LinkedIn ne met pas en forme

LinkedIn n'affiche que du texte brut. Les accroches en gras deviennent des lettres grasses Unicode,
les liens vont dans un premier commentaire publié juste après, et les limites (3 000 caractères,
taille et durée des vidéos) sont vérifiées avant tout envoi.

## Testé et livré

La logique de publication est couverte par des tests unitaires Python avec une horloge factice : rien
avant l'heure, un matin manqué rattrapé, un jour passé jamais envoyé en retard, le même texte refusé,
chaque type d'échec, le premier commentaire, et un essai à blanc qui n'envoie rien. Le projet est
livré avec un site et un prompt pour un agent de code qui installe tout avec vous, tandis que les
clics LinkedIn et le token restent entre vos mains et que rien n'est publié sans votre accord.

## Limites et suite

Il publie sur un profil personnel uniquement : les pages d'entreprise exigent l'examen de l'API
Community Management de LinkedIn. cron ne tourne que quand la machine est allumée, donc la certitude
demande un petit serveur toujours allumé. Et le token doit être renouvelé tous les deux mois, ce qui
prend une minute.

La prochaine version est prévue sous la forme d'un paquet npm plus complet : les mêmes garanties,
installées en une commande au lieu d'un dossier cloné.
