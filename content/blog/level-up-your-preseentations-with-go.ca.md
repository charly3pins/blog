+++
title = "Pujeu de nivell les vostres presentacions amb Go"
date = "2020-10-06"
author = "charly3pins"
description = "Genera fàcilment les teves presentacions amb \"present\", l'eina impulsada per Go que genera i renderitza les teves diapositives."

slug = "Pujeu de nivell les vostres presentacions amb Go"
tags = ["go", "life"]
category = "technology"

image = "/images/level-up-your-presentations-with-go/GOPHER_MIC_DROP_WITH_BACKGROUND.png"
+++

Si sou una persona tècnica i no us agrada lluitar amb els programes de presentació però voleu / necessiteu crear-ne un, enhorabona! estàs al lloc correcte. Sé que, com a enginyers de programari, volem codificar, llegir o mirar coses relacionades amb programari, arquitectura o devops, però no amb presentacions. De vegades, se’ns exigeix ​​que presentem alguna cosa a altres membres de l’equip, als propietaris de productes o fins i tot més aterridors, a l’equip directiu.

Per aquest motiu, vull presentar-vos el paquet Go [present](https://godoc.org/golang.org/x/tools/present). S'utilitza per crear diapositives a Golang allotjades a discussions.golang.org o a la vostra privada. L’he utilitzat diverses vegades, sobretot quan vull compartir alguna cosa amb els meus companys de l’equip (algun codi, és clar), perquè no vull perdre el temps amb els programes. Acabo de crear el projecte per a les diapositives, afegeixo les meves diapositives a la marca, afegeixo les imatges necessàries i les presento. Vegem detalladament com funciona!

Suposant que teniu Go [instal·lat](https://golang.org/doc/install) i configurat correctament, tot el que heu d’instal·lar és el paquet amb la comanda següent:
```vim
go get -u golang.org/x/tools/present
```

Comproveu si funciona escrivint:
```vim
present
```

Hauria de mostrar un missatge similar a:
```vim
2020/10/04 23:23:54 Open your web browser and visit http://127.0.0.1:3999
```

Per tant, podeu visitar l’enllaç i veure el servidor local preparat per allotjar les vostres presentacions. Increïble o no? D’acord, sé que voleu mostrar alguna cosa que no sigui un directori buit, així que anem a crear un exemple de presentació per a això.

## Format

Creeu un directori per a les diapositives:
```vim
mkdir go-present-example
cd go-present-example/
```

Creeu la primera diapositiva:
```vim
vim initial.slide
```

I afegiu el següent contingut:
```
Learning Go present
6 October 2020

Crash Bandicoot
crash.bandicoot@gmail.com

* Hello World

I'm a slide
```

Per tant, si torneu a executar la comanda `present` dins de la vostra carpeta i aneu de nou al navegador hauríeu de poder veure la pantalla següent:
![initial slide](/images/level-up-your-presentations-with-go/initial-slide.jpeg)

Feu clic a l’enllaç `initial.slide` i admireu la vostra presentació.
![initial presentation](/images/level-up-your-presentations-with-go/initial-presentation.jpeg)

Com podeu veure, la primera línia és el títol, la segona la data i després la segueix l’autor. A la segona diapositiva, en realitat la primera, apareix el títol de la diapositiva i el text d’aquesta. L'últim mostra un títol d'agraïment i el vostre nom i contacte (correu electrònic, twitter, etc.) que heu afegit a la diapositiva. Vegeu-ho a continuació:
![end presentation](/images/level-up-your-presentations-with-go/end-presentation.jpeg)

## Sintaxi heretat de present

És compatible amb Markdown, però aquí explorarem la [sintaxi heretat de present](https://godoc.org/golang.org/x/tools/present#hdr-Legacy_Present_Syntax), ja que el Markdown té molts recursos on podeu comprovar . Així que explorem una mica les funcions que ofereix "present" per formatar i mostrar text a les nostres diapositives.

Primer són les opcions clàssiques per formatar el text:
```text
normal vs `highlighted`
*bold*
_italic_
*multiple*bold*text*
_multiple_italic_text_
```

I el resultat és:
![text formatting](/images/level-up-your-presentations-with-go/text-formatting.jpeg)

També pot afegir una llista:
```text
Grocery list for the gopher:

- go routines
- garbage collector
- Rust
```
![text formatting list](/images/level-up-your-presentations-with-go/text-formatting-list.jpeg)

O un nivell diferent de subseccions així:
```
** Subsection

Gopher is diving the subsection.

*** Sub-subsection

Another Gopher is diving more into the sub-subsection!
```

I veureu la diapositiva com aquesta bogeria:
![text formatting subsections](/images/level-up-your-presentations-with-go/text-formatting-subsections.jpeg)

![gophers](/images/level-up-your-presentations-with-go/gophers.gif)

## Invocacions de comandes

A part del format de text, hi ha una [invocacions de comandes especials](https://godoc.org/golang.org/x/tools/present#hdr-Command_Invocations) que podeu invocar per portar la vostra presentació a un altre nivell.

### imatges i vídeos

La comanda `.image` injecta una imatge a la diapositiva. Accepta 1 o 3 arguments (nom, alçada, amplada). El nom és obligatori, altres dos han d'estar presents o substituïts per un `_`.
```text
.image /images/gopher.jpeg 200 200
.image /images/gopher.jpeg _ 300
```

![images](/images/level-up-your-presentations-with-go/images.jpeg)

Igual que les imatges, podeu fer el mateix amb un vídeo mitjançant la comanda `.video`. Accepta 2 o 4 arguments (nom, tipus de contingut del fitxer, alçada, amplada). El nom i el tipus de contingut del fitxer són obligatoris; altres dos han d’estar presents o substituïts per i `_`.
```text
.video videos/gopher-dance.mp4 video/mp4 400 600
.video videos/gopher-dance.mkv video/mkv 500 _
```

De manera similar a les imatges, també té la comanda `.background` per configurar la imatge de fons d'una diapositiva. Només té un argument com a nom de fitxer de la imatge.
```text
.background images/susan.jpg
```

### enllaços
Si heu d'inserir un enllaç a la presentació, podeu utilitzar la comanda `.link`. Accepta 1 o 2 arguments (URL HTTP, etiqueta de text). L'URL HTTP és obligatori, el segon és opcional.
```text
.link https://charly3pins.dev charly3pins website
.link https://charly3pins.dev
```

![links](/images/level-up-your-presentations-with-go/links.jpeg)


### codi
La millor comanda en la meva opinió és la de `.code`. Us permet posar codi extret dels fitxers font i injectar-los com a blocs <pre> escapats per HTML. Accepta un argument com a nom de fitxer seguit d’una adreça opcional que especifica quina secció del fitxer es mostrarà.

Per exemple, prenent Hello world a Go com a codi font:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!")
}
```

Hem d’especificar com a:
```text
.code hello.go
```

I es mostrarà així:
![code](/images/level-up-your-presentations-with-go/code.jpeg)

Però, què passa si voleu ressaltar alguna part del codi? No us preocupeu, present té aquest "present" i podeu afegir-hi les "adreces opcionals" que hem comentat a continuació. Per tant, modifiqueu el codi així per ressaltar la trucada `Printf`:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!") // HL
}
```
I utilitzeu la mateixa comanda a la diapositiva:
```text
.code hello-hl.go
```

Per veure el codi ressaltat:
![code-hl](/images/level-up-your-presentations-with-go/code-hl.jpeg)

Un pas més! Si només voleu mostrar una part del vostre codi, per exemple, amagar el paquet i les importacions del fitxer, també podeu afegir els fragments següents:
```go
package main

import "fmt"

//START OMIT
func main() {
	fmt.Println("Hello world!") // HL
}
//END OMIT
```
Torneu a utilitzar la mateixa ordre però afegint el fragment següent:
```text
.code hello-hl-partial.go /START OMIT/,/END OMIT/
```

I vegeu el codi parcialment mostrat:
![code-hl-partial](/images/level-up-your-presentations-with-go/code-hl-partial.jpeg)

#### play

Aquesta ordre és superpotent per ajudar-vos a presentar algun codi i ressaltar o amagar algunes parts. Però l’espectacle ha de continuar i la millor part és la següent. La comanda `.play` és com el del `.code`, però posa un botó a la font descatalogada i podeu executar el programa des del navegador. És màgia o no?
![magic](/images/level-up-your-presentations-with-go/magic.gif)

Utilitzem el mateix codi font que estem utilitzant i afegim la nova ordre a les diapositives així:
```text
.play hello.go
```

Apareixerà com el del "codi", però si observeu a l'extrem inferior dret, apareixerà un petit botó `Run`.
![code-play](/images/level-up-your-presentations-with-go/code-play.jpeg)

En executar el codi es mostrarà una petita finestra negra a la pantalla on es mostrarà la sortida del codi:
![code-played](/images/level-up-your-presentations-with-go/code-played.jpeg)

## Notes del presentador

Per últim, però no menys important, és una cosa interessant que també proporcionen. És ben sabut que als programes de PowerPoint o similars podeu afegir les vostres notes només per a vosaltres quan presenteu la presentació i de vegades són molt útils. Així doncs, "present" també ho té en compte i podeu afegir les vostres notes de presentació només afegint un `:` al començament de la frase i aquest text es tractarà com una nota de presentador.

Per exemple:
```text
* Presenter notes

The gophers like to eat a lot.

: they eat more than half their body weight in food each day

They eat basically plants.

: typically gnaws the roots of a plant just beneath the soil, so the damage isn’t seen
```
![present-notes](/images/level-up-your-presentations-with-go/present-notes.jpeg)


Com podeu veure, les notes no hi són presents, per què? Perquè necessiteu executar la presentació en un "presentador" així.
```vim
present -notes
```

I hauria de mostrar un missatge similar a:
```vim
2020/10/04 23:23:54 Open your web browser and visit http://127.0.0.1:3999
2020/10/04 Notes are enabled, press 'N' from the browser to display them.
```

Per tant, si actualitzeu el navegador amb la presentació i premeu `N`, veureu una finestra emergent que mostra les notes de cada diapositiva a la part inferior de la manera següent:
![present-notes-popup](/images/level-up-your-presentations-with-go/present-notes-popup.jpeg)

## Conclusió

L'eina `present` és molt útil per a presentacions tècniques, especialment en Go. Té limitacions com el format de les diapositives i el posicionament de la imatge de vegades difícil, però en general és un paquet fantàstic i per a mi és l'estàndard de totes les meves presentacions. Si voleu aprofundir en aquest paquet, consulteu la [documentació oficial](https://godoc.org/golang.org/x/tools/present) i també us recomanaria la [presentació](https://discussions.golang.org/2012/insidepresent.slide#1): `Inside the "present" tool` d'Andrew Gerrand. També he penjat el codi font d’aquest tutorial a [GitHub](https://github.com/charly3pins/go-present-example).
