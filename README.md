# My Creative Museum

Projet ECV sous Next.js App Router, JavaScript, Tailwind v4, Geist et Instrument Serif.

## Démarrer

Node.js >= 20.9. `npm ci`, puis `npm run dev`. L’aperçu en cours utilise `npm run dev -- --port 3001`.

`npm run build` produit le build de production ; `npm start` le sert. `npm run lint` vérifie le code et `npm run format` le formate.

## Pages et rendu

- `/` : accueil éditorial, sélection de trois œuvres, à propos. Rendu statique régénéré après une heure (ISR).
- `/collection` : recherche instantanée, filtres artiste/mouvement et tri. Métadonnées rendues à la demande à partir de `searchParams` (SSR) ; données API mises en cache une heure. Les filtres clients sont reflétés dans l’URL et combinables.
- `/oeuvres/[slug]` : 29 routes préconstruites via `generateStaticParams`, puis ISR. Métadonnées propres à chaque œuvre, notice, galerie, musée source et trois œuvres liées.
- `/billetterie` : page prérendue et calculateur client. Tarifs du brief, groupes dès 11 personnes, options limitées au nombre de visiteurs, gratuité des moins de 5 ans.
- `loading.js`, `error.js`, `not-found.js` : chargement, erreur récupérable et œuvre inconnue.

## Animations et absence de flash

- `src/stores/use-museum-store.js` : Zustand, `isFirstRender` et `isTransitionActive`.
- `src/lib/gsap.js` : enregistrement centralisé de `useGSAP`, `ScrollTrigger`, `CustomEase`.
- `src/components/animation/page-transition.js` : preloader présent et opaque dès le HTML serveur. Le petit logo se dessine, la signature apparaît, puis le panneau quitte l’écran. Attente des polices et du décodage de la première image, avec limite de temps. Les tracés sont masqués dans le CSS initial, sans apparition préalable du logo complet.
- La première arrivée est lancée sous le panneau pour éviter de montrer un élément avant son animation. Le preloader est joué au chargement du document, une seule fois durant la navigation interne. Il n’est pas persisté entre rechargements.
- `TransitionLink` respecte les clics modifiés, les nouveaux onglets et les ancres. La navigation attend le callback de fin d’animation, sans temporisation arbitraire. Comme sur le portfolio, la page se réduit, sort à gauche, puis la suivante arrive de droite et reprend sa taille. Un délai de secours libère le panneau si une navigation échoue.
- `GSAPWrapper` limite ses sélecteurs à son scope : `data-arrive` pour les arrivées et `data-reveal` pour les révélations au scroll. Les animations et ScrollTriggers sont nettoyés via `useGSAP`/`matchMedia`. Callbacks différés enveloppés par `contextSafe`.
- Le mode `prefers-reduced-motion` évite les mouvements. Sans JavaScript, le preloader est retiré via `noscript`. Un secours CSS le retire également si le JavaScript ne se charge pas.
- Dimensions des images réservées pour limiter les déplacements de mise en page.

## Direction artistique

Papier clair, bleu encre, accents olive, grands blancs et typographie éditoriale. Nouveau M double tracé à main levée : logo React animable, SVG autonome et favicon. Les œuvres conservent une place centrale.

La base de rem demandée est conservée dans `@layer base` : viewport / 390 × 16 sur mobile, viewport / 1440 × 16 dès 1024 px, le même ratio desktop sur les écrans ultrawide (le plafond fixe a été retiré à la demande de l’utilisateur). Elle redimensionne textes et espacements ensemble. Geist est déclarée sur `html` via `next/font` et réutilisée dans les tokens Tailwind.

## Données et limites

Les données proviennent de https://api-museum.vercel.app/objects et `/objects/{slug}`. L’API retourne maintenant une enveloppe `objects` et des informations de pagination : l’adaptateur la prend en charge. Les champs absents et erreurs réseau sont traités. Les descriptions HTML sont nettoyées côté serveur avec une liste explicite de balises autorisées.

Les miniatures Wikimedia de tailles arbitraires (2560/1920 px dans l’API) sont normalisées à 1280 px. Certaines images peuvent être temporairement limitées par leur hébergeur (HTTP 429) : une indication remplace alors l’image, sans bloquer la visite. Les images sont servies via Next Image avec domaines autorisés et chargement différé hors premier écran.

Les notices restent en anglais, comme dans l’API. La billetterie est une simulation de calcul : aucune commande, aucun paiement ni billet réel. La connexion réseau est nécessaire pour le premier build (API et polices). Aucun secret n’est requis.

## Références du cours consultées

Sujet : https://deluxe-breeze-6a8.notion.site/M2-DEV-Projet-Mus-e-26c85fcf2f3780e783e4ca3acf9b2a9c

Sous-pages consultées : API Museum ; store global Zustand ; modes SSR/SSG/ISR ; passage Pages Router vers App Router (page contenant une vidéo) ; conventions Next ; params/searchParams ; GSAP wrapper ; TransitionLink ; Page transition ; bases GSAP ; système de filtres.

Adaptations à Next 16 : `params`/`searchParams` asynchrones et cache de fetch explicite. Les exemples du cours utilisent parfois Next 14, dont les valeurs par défaut diffèrent. Les filtres sont dérivés des paramètres actifs plutôt que stockés une seconde fois, ce qui évite la désynchronisation.

La publication Vercel, le dépôt distant et le retour critique personnel demandés en livrables par le cours restent à préparer. Ce projet reste local à ce stade.

## Interactions ajoutées

- `Media` reprend le composant fourni : `forwardRef`, détection vidéo (y compris URL avec query), `NextImage`, `preload`, `sizes` corrigé et props de positionnement. Toutes les reproductions passent par ce composant. `ArtworkImage` réserve l’espace et déclenche l’apparition après décodage, avec CSS masqué dès le serveur.
- `FlipText` : deux faces par lettre, translation et rotation 3D en vague via `useGSAP`, au pointeur comme au focus. Les deux faces visuelles sont masquées aux lecteurs d’écran ; le libellé n’est lu qu’une fois. Les icônes restent fixes.
- `Menu` : bouton MENU et SVG à deux traits décalés, disponible sur desktop et mobile. Volet entrant par la droite et sortant à gauche, liens vers toutes les pages, fermeture Échap et restauration du focus.
- `CustomCursor` : remplace le pointeur natif par une croix de 24 px ; scale à 0.6 et rotation de 45° sur les liens/boutons ; capsule « Voir l’œuvre » sur les tableaux. Désactivé sur écran tactile et en mouvement réduit. Le curseur natif revient dans les champs de saisie et au clavier.
- Footer en arrière-plan, découvert par le contenu au scroll ; le mode sticky n’est activé que lorsque le footer tient dans la fenêtre.

Le portfolio local a été consulté en lecture seule. La transition Astro View Transitions a été adaptée en GSAP pour cet App Router. Les bases visuelles retenues parmi les références fournies sont le grand menu, les compositions éditoriales et les micro-interactions ; aucun contenu de ces sites n’est repris.

## Vérification de cette version

Build de production réussi avec les 29 fiches préconstruites ; réponses serveur vérifiées pour l’accueil, la collection filtrée, la billetterie et une fiche. Calculs de billets vérifiés (tarifs, groupe, gratuité, options bornées). Une image Wikimedia peut encore répondre HTTP 429 ; ce cas affiche une indication et ne bloque pas le chargement. Recette navigateur effectuée : navigation accueil → collection → œuvre, recherche Monet avec Entrée, menu mobile et focus clavier, panier adulte + audioguide (26 €). Contrôles de largeur à 320, 390 et 3440 px sans débordement horizontal sur les pages inspectées. `npm test` exécute 22 tests de données et de régression GSAP, dont 25 cycles de nettoyage des contextes. Le survol précis du curseur reste à apprécier à la souris.


## Organisation du code

- `src/app/` : routes Next.js, layout racine et styles globaux.
- `src/components/layout/` : header, menu et footer partagés.
- `src/components/animation/` : transitions, scroll, curseur et animations de texte.
- `src/components/ui/` : primitives réutilisables (icônes, logo, médias).
- `src/components/artwork/` : cartes et images des œuvres.
- `src/components/home/` : hero animé, galerie et cylindre Three.js.
- `src/components/collection/` : recherche, filtres et grille de la collection.
- `src/components/billetterie/` : calculateur et présentation du billet.
- `src/lib/` : accès API, calculs, recherche et configuration GSAP.
- `src/stores/` : état partagé Zustand.
- `work/qa/` : tests de données et de régression, exécutés par `npm test`.

Les styles propres à un composant restent dans son dossier. Les imports utilisent `@/` et pointent directement vers le fichier concerné.
