+++
title = "Comprensió de la Versió Semàntica 2.0 (SemVer)"
date = "2020-10-20"
author = "charly3pins"
description = "Què és la versió semàntica? Per què és important utilitzar-lo en els vostres projectes com a desenvolupador? Què significa per a un usuari que utilitza la vostra biblioteca?"

slug = "Comprensió de la Versió Semàntica 2.0 (SemVer)"
tags = ["api"]

image = "/images/semver.png"
+++
Quan vulgueu utilitzar una biblioteca al vostre projecte, probablement haureu notat que cal especificar una versió. La majoria de les vegades, aquestes versions tenen el format de 3 nombres separats amb punts entre ells. Aquest format és indicatiu que la biblioteca utilitza el [Versió semàntica](https://semver.org) també conegut com SemVer. Aquest document especifica el format i la forma d’etiquetar els vostres projectes durant tot el cicle de vida dels mateixos. És només una convenció perquè pugueu definir el número de versió tal com vulgueu, però el cert és que altres desenvolupadors de totes les indústries van acordar utilitzar-lo i es va convertir en un estàndard per a la versió.

L’objectiu és tenir diferents versions del paquet seguint la regla que cada vegada que actualitzeu el paquet, actualitzeu la versió. Amb això, el que s'aconsegueix és tenir un nom i una versió únics per a cada paquet públic. Per utilitzar SemVer, heu de declarar una API pública. Això es deu al fet que la versió de versions proposada es basa en els canvis respecte a la versió anterior de l'API, de manera que si no n'especifiqueu cap (fins i tot codificada o només documentada) no és possible aplicar aquestes regles.

El format del SemVer és l’esmentat abans de 3 números separats amb un punt entre ells:
`MAJOR.MINOR.PATCH`

La forma d’incrementar cada número es descriu al document. Com a resum:
- Les noves funcions amb versions de comportament incompatibles (trenca l'API) augmenten la MAJOR;
- Les noves funcions compatibles amb la versió anterior (no trenca l'API) augmenten el MINOR;
- Les correccions d'errors augmenten el PATCH;

NOTA: El desenvolupament inicial utilitza una versió principal 0.
NOTA2: Quan s'incrementa el MENOR, el PATCH es restableix a 0; Quan s'incrementa el valor MAJOR, el MENOR i el PATCH es restableixen a 0.

Com a cas especial, podeu utilitzar les versions prèvies a la versió. Es denoten afegint un guionet i les següents cadenes acceptades a nivell mundial:
- alpha;
- beta;
- rc (release candidates);

Seguit del número de versió necessari. Per tant, les versions anteriors al llançament haurien de seguir un ordre similar com:
- 1.0.0-alpha
- 1.0.0-alpha-1
- 1.0.0-beta
- 1.0.0-beta.2
- 1.0.0-beta.10
- 1.0.0-rc.1
- 1.0.0-rc.40
- 1.0.0

NOTA: Una API es considera publicada a partir del 1.0.0.

Quan vulgueu utilitzar el SemVer, podeu especificar una versió exacta o no. Per a això, podeu utilitzar les eines següents:
- Si voleu una versió exacta, indiqueu la dependència amb: X.Y.Z;
- Si voleu utilitzar la versió actual o versions superiors, fins i tot amb canvis de ruptura a l'API, podeu utilitzar el tipus `>` com:> X.Y.Z;
- Si voleu tenir la versió actual o actualitzada, però amb compatibilitats anteriors, podeu utilitzar el format `^` com: ^ X.Y.Z (on es fixa X);
- Si voleu tenir la versió actual o actualitzada només amb correccions d'errors amb canvis de nivell menor, podeu utilitzar el tipus `~` com: ~ X.Y.Z (on es fixen X i Y);

Per tant, després de llegir aquest article com a desenvolupador que utilitza la biblioteca d'un altre, podeu saber quin tipus de canvis van fer quan us van presentar la nova versió seguint les regles descrites anteriorment:
- Nova versió 0.2.3 → Els canvis poden ser només correccions d'errors;
- Nova versió 0.5.0 → S'han afegit algunes funcionalitats, però compatibles amb l'API;
- Nova versió 5.0.0 → Pot ser que hi hagi un problema perquè va introduir canvis trencats amb l'API;

Com a conclusió, l’avantatge d’utilitzar SemVer contra no:
- Compatibilitat / dependències més clares;
- Fomenta les API ben definides;
- Aclareix les decisions d’actualització;
