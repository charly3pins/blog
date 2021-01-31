+++
title = "Gestió de plantilles i contingut d'Hugo"
date = "2020-03-08"
author = "charly3pins"
description = "Com organitzar el vostre contingut i crear les vostres plantilles per obtenir el màxim valor d’Hugo."

slug = "Gestió de plantilles i contingut d'Hugo"
section = "/blog"
tags = ["hugo", "cms"]

image = "/images/gohugoio-card.png"
+++

Després de molt de temps sense escriure... he tornat!

![I'm back](/images/hugo-content-templates-managing/im-back-terminator.jpg)

Tenia previst reconstruir el meu lloc i començar a crear contingut de nou, però mai no he trobat el temps fins ara.

Volia fer el meu tema des de zero en lloc d’utilitzar un [tema predefinit](https://themes.gohugo.io/), així que vaig haver d’aprendre com es fan les plantilles i la gestió del contingut a Hugo.

Un cop fet aquest procés, vull resumir les coses més importants que considero que heu de saber si voleu fer el vostre propi tema com ho vaig fer jo (aquest lloc ho demostra!).

## Gestió de continguts

Primer de tot, parlem de la [organització de contingut] (https://gohugo.io/content-management/organization/) a Hugo.

Tot el contingut que vulgueu tenir al vostre lloc ha d'estar dins del directori `content/`. Simplement poseu les vostres publicacions dins de `content/posts` i la vostra descripció a `content/about` i Hugo us farà la màgia. Sembla fàcil oi? Continueu llavors.

Hugo té principalment dos tipus de pàgines, les "úniques" i les "múltiples". Els primers s'utilitzen, per exemple, per a un "about" o per a un "faq" o un "contribuir" o un "landing" ... Els segons s'utilitzen quan es vol agrupar contingut en una mateixa categoria. Per exemple, les vostres diferents publicacions per a les vostres publicacions o un catàleg per als vostres productes. Dit això, hi ha una altra diferència que heu de saber quan creeu les vostres diferents pàgines.

Els únics s'han de nomenar com a "index.md", els de la llista no. Això al final indica a Hugo com gestionar el contingut dins dels directoris i com generar les URL per accedir-hi. L'esquema següent mostra com funciona això:

```
└── content
    └── about
    |   └── index.md        (https://mysite.com/about)
    ├── posts
    |   ├── first-post.md   (https://mysite.com/posts/first-post)
    |   └── second-post.md  (https://mysite.com/posts/second-post)
    |   └── trips
    |       └── pandora.md  (https://mysite.com/posts/trips/pandora)
    └── faq
        └── index.md        (https://mysite.com/faq)
```

També hi ha la possibilitat d'especificar l'URL mitjançant la propietat `slug` com slug ="my-custom-url".

## Gestió de plantilles

Ara ja sabeu com organitzar el vostre contingut, és hora de parlar de les [plantilles](https://gohugo.io/templates/). Són el codi HTML que genera les pàgines del vostre lloc. Hi ha alguns trucs i consells que vull compartir amb vosaltres, com he fet amb el contingut de la secció anterior.

Les diferents plantilles s'han de col·locar dins del directori `layouts/`. A l'arrel ha d'haver-hi la plantilla principal anomenada `index.html` que s'utilitza per representar la pàgina d'inici. De la mateixa manera que el contingut, les plantilles es poden organitzar en carpetes si voleu mostrar de diferents maneres el contingut en funció de la ruta. Igual que el contingut, les plantilles es poden organitzar entre exclusives i múltiples. Prenent l'organització de contingut descrita anteriorment, tenint en compte que voleu especificar plantilles diferents per a cada carpeta de contingut, una de les organitzacions de plantilla possibles pot ser:

```
└── layouts
    └── _default_
    |   ├── list.html
    |   └── single.html
    └── posts
        ├── list.html
        └── single.html
        └── trips
            ├── list.html
            └── single.html
```

Analitzant-ho en detall, podeu veure un arbre similar al contingut, però amb una particularitat que no inclou cap carpeta `about` ni `faq`, però apareixia com a `_default`. Hugo utilitza aquesta carpeta especial per representar les pàgines que no tenen la seva pròpia plantilla. En aquest cas, sobre i les preguntes freqüents, ambdós tipus únics, es representaran mitjançant la plantilla `layouts / _default / single.html`. Si el directori `viatges` no existia, les plantilles utilitzades seran les `_default`.

En aquest moment ja sabeu sobre l'organització del contingut i la gestió de plantilles, però esteu pensant:
> Com sap Hugo quan vull utilitzar una sola pàgina o una llista?

La resposta depèn de la URL i del contingut que hi hagi. Si torneu a utilitzar l'exemple anterior per a l'organització del contingut, si observeu que `about` conté un `index.md`, de manera que indica que Hugo és una pàgina "única". Com que no vam definir cap plantilla en concret, la que s'utilitzarà és el genèric `_default/single.thml`.

D'altra banda, dins de `posts` hi ha tres publicacions, però no hi ha cap "index.md", de manera que indica a Hugo que és una pàgina "multi", de manera que faràs servir les dues plantilles, la `list.html` com un "índex" de les vostres publicacions i el `single.html` de cada publicació. Per representar el `list.html`, heu d'anar a l'URL del directori (https://mysite.com/posts/). Per a les publicacions (https://mysite.com/posts/first-post) i (https://mysite.com/posts/second-post) la plantilla utilitzada serà `single.html`.

### Variables de pàgina

Les pàgines tenen un conjunt de variables útils que és bo saber:
- Title: el títol del missatge
- Description: una descripció breu o llarga del missatge
- Content: el cos de la publicació
- ReadingTime: els minuts que Hugo calcularà automàticament trigaran a llegir la publicació

Per accedir als paràmetres personalitzats que podeu crear a cada publicació, haureu d’accedir-hi per nom dins de l’objecte `Params` (Params.yourParam).

Podeu mostrar publicacions relacionades llegint els resultats de la pàgina `.Site.RegularPages.Related`.

Consulteu la llista completa a la pàgina [documentació](https://gohugo.io/variables/page/).

La plantilla `list.html` s’utilitza per mostrar una breu descripció de les publicacions, com ara un índex de llibre, amb els enllaços a la publicació real. Per fer-ho, heu d’accedir a la variable `$.Paginator.Pages` i fer un recorregut pels resultats. Les variables són les mateixes descrites anteriorment amb un `PermaLink` més, el que heu d'utilitzar per accedir a la publicació (i truqueu a la plantilla `single.html`) per a aquest contingut.

També hi ha les variables `PrevInSection` i `NextInSection` per a paginar els resultats.

### Plantilles parcials

L'últim consell que vull explicar-vos és que no cal que repetiu totes les parts de les plantilles, podeu extreure la part comuna en una plantilla i tornar-la a utilitzar a qualsevol lloc que vulgueu. Aquestes són les [plantilles parcials](https://gohugo.io/templates/partials/). La seva particularitat és que heu de col·locar aquesta part dins d'un directori `partials/` i anomenar-la com a `{{partial "name.html" . }}`. Són útils per al `header`, `footer`, `navbar` i altres parts genèriques, així com per a una plantilla de llista que voleu reutilitzar per a les vostres publicacions i per als vostres viatges, per exemple.
