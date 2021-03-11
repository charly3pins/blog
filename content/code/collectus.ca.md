+++
title = "Collectus"
date = "2018-09-22"
author = "charly3pins"
description = "Com a projecte final de carrera en enginyeria informàtica, vaig crear una base de dades flexible per a col·leccionisme i qualsevol altre objecte o dada que qualsevol usuari vulgui ordenar i classificar d'una manera senzilla i eficaç."

weight = "1"

tags = ["php", "javascript"]
+++
## PER QUÈ

La motivació d’aquest projecte és mig personal i meitat acadèmica. Deixa'm explicar. A casa, el meu pare sempre va recollir moltes coses, des dels llibres més antics que es poden imaginar fins al nou Funko POP més recent, passant per ganivets suïssos o daus, entre d’altres. Tenir aquesta varietat d’objectes i molts d’ells (massa per ser honest) catalogar aquella quantitat d’elements sempre havia estat un repte per a ell.

Sempre va intentar classificar de diferents maneres, com ara fer servir un Excel, aplicacions gratuïtes, aplicacions de pagament, etc. Al final, cada vegada que passa alguna cosa similar, el handicap de la seva "col·lecció de col·leccions" (tal com el descriu) és massa singular, i no encaixa enlloc. Ell és desenvolupador i jo vaig estar el darrer any a la Universitat estudiant Enginyeria Informàtica, així que vam començar a planificar com podríem resoldre aquest problema fent-nos nosaltres mateixos l’aplicació.

Al cap d’uns dies / setmanes em vaig adonar que aviat hauria de triar un projecte per presentar-lo com a Projecte de Final de Carrera, així que vaig decidir provar aquesta boja idea familiar i proposar-la al meu tutor. Estava emocionada amb la idea que teníem i va acceptar feliç.

Un cop vaig tenir l’aprovació del meu tutor, va ser una novetat increïble, ja que el projecte personal que volíem desenvolupar en els nostres temps lliures, ara vaig tenir l’oportunitat de dedicar tot el meu esforç no només a resoldre el problema que teníem, sinó a presentar-lo. com a projecte final. I així va començar tot.

Al final, el projecte va acabar tenint un gran èxit, el meu tutor va quedar encantat amb el resultat, i al tribunal li va agradar molt, fins i tot em van dir que els enviés un correu electrònic quan el posés en producció perquè el poguessin utilitzar i catalogar col·leccions pròpies.

## QUÈ

Vaig trucar a l'aplicació Collectus, ja que és la paraula llatina que significa "reunir, recollir", de manera que en aquest cas s'adapta perfectament. És una base de dades flexible del sistema per a col·leccionables i qualsevol altre objecte o dada que l'usuari vulgui ordenar i classificar. Collectus està pensat per a col·leccionistes, cosa que els permet fer un seguiment de qualsevol tipus de col·lecció que tinguin, mitjançant una base de dades del sistema amb una estructura oberta adaptable a totes les necessitats. També proporciona dos tipus d’inici de sessió per als usuaris, creant-ne un de nou per a la plataforma o utilitzant el seu compte de Facebook que el connecta amb l’API de Facebook.

![app](/images/code/collectus/main-app.jpeg)
![login](/images/code/collectus/login.jpeg)

Mitjançant plantilles l’usuari pot establir tot tipus de registres per a articles tan diversos com segells o places de cava, pòsters o fòssils, ninots de drap o bitllets de loteria. Un cop definida la plantilla (categoria) per a l'objecte o el tipus d'objecte d'interès, l'usuari pot introduir dades immediatament.

![item edit](/images/code/collectus/item-edit.jpeg)
![amazon mapping](/images/code/collectus/amazon-mapping.jpeg)

Per facilitar tota aquesta tasca, incorpora eines per ajudar l’usuari. El més destacat que proporciona l'API del producte Amazon per llegir automàticament la informació de la seva base de dades en el moment de l'entrada de dades.

![amazon search](/images/code/collectus/amazon-search.jpeg)

A partir d’aquí els usuaris podran llegir informació segons diversos criteris de cerca que s’ofereixen a l’aplicació i emmagatzemar-la. També hi ha una comparació de preus entre les diverses botigues d’Amazon de tots els països per trobar preus diferents i ajudar a comprar articles als usuaris.

![amazon results](/images/code/collectus/amazon-results.jpeg)

Tot això s’ha desenvolupat sota una atractiva interfície gràfica d’usuari i la usabilitat com a objectiu principal.

Llenguatges de programació i eines utilitzades per a aquest projecte:
- PHP 5, JavaScript i jQuery per al backend
- HTML i CSS per al frontend
- AJAX com la forma de trucar al costat del servidor
- API del producte Amazon per a la investigació de productes i la comparació de preus
- API de Facebook per a l'inici de sessió

## PENSAMENTS FINALS

Va ser el meu primer gran projecte com a desenvolupador de programari construint una web i vaig aprendre moltes coses com aprendre nous llenguatges de programació i arquitectura dels projectes; dissenyar correctament les bases de dades; polir el mínim detall visual; batalla amb API externes que es connecten a elles; organitzar-me per tal de lliurar petits trossos del projecte pas a pas en lloc de fer-ho tot al mateix temps; escriviu la documentació adequada sobre la funcionalitat del projecte i moltes altres probablement.

Sempre he volgut fer una segona versió millorada del projecte, ara amb l’experiència que tinc i les habilitats que he anat adquirint al llarg d’aquests anys de treball. He començat diverses vegades però mai he acabat ...

Espero que algun dia pugueu llançar oficialment l’aplicació i parlar-ne aquí. 🚀