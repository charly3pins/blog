+++
title = "Com afegir Google Analytics al vostre lloc amb Hugo"
date = "2020-11-23"
author = "charly3pins"
description = "Tutorial ràpid sobre com integrar Google Analytics en un lloc web Hugo."

slug = "Com afegir Google Analytics al vostre lloc amb Hugo"
section = "/blog"
tags = ["hugo", "cms"]

image = "/images/google-analytics-hugo.png"
+++
## Google Analytics

En primer lloc, el que necessiteu és obtenir un identificador de seguiment de Google Analytics. Per a això, cal que us inscriviu a [Google Analytics](https://analytics.google.com/analytics/web/). A continuació, heu de crear un identificador de seguiment seguint els passos següents:

- Feu clic al botó `Admin` (a l'extrem inferior esquerre).
- Feu clic al botó `Create Account`.
- Després de completar tots els passos, feu clic al botó `Create` i accepteu els termes i condicions.

Després de completar aquests passos, obtindreu el vostre identificador de seguiment. Copieu-lo per afegir-lo al vostre lloc Hugo més endavant.

## Configuració Hugo

Ara és el torn d'afegir l'identificador de seguiment al vostre lloc.
La forma més senzilla de fer-ho és mitjançant la [plantilla interna d'Hugo](https://gohugo.io/templates/internal/#google-analytics) proporcionada per Hugo. Només cal afegir una nova variable anomenada `googleAnalytics` amb el `tracking ID` obtingut del pas anterior del vostre `config.toml`, com ara:
```vim
googleAnalytics = "UA-123-45"
```

El següent pas és afegir el fragment de codi següent al vostre lloc:
```vim
{{ template "_internal/google_analytics.html" . }}
```
Heu de buscar la plantilla parcial `head` i afegir-la dins de les etiquetes `<head></head>`.

## Comprovació de la integració

Abans de passar-ho a la producció, podeu provar-lo executant el vostre lloc localment realitzant l'ordre següent:
```vim
hugo serve
```

L'URL per defecte a localhost és `http://localhost:1313`.

Obriu de nou o actualitzeu [Google Analytics](https://analytics.google.com/analytics/web/) en una pestanya diferent.

Consulteu el tauler i podríeu veure el número a la secció Usuaris actius ara mateix com 1 com la imatge següent:
![active-users](/images/google-analytics-active-users.png)