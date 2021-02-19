+++
title = "Com tenir un lloc multilingüe a Hugo"
date = "2021-02-05"
author = "charly3pins"
description = "Conegueu les configuracions i els trucs per convertir el vostre lloc d'un sol idioma en Hugo a un lloc multilingüe en només uns quants passos."

slug = "Com tenir un lloc multilingüe a Hugo"
tags = ["hugo", "cms"]
category = "technology"

image = "/images/gohugoio-card.png"
banner = "/images/gohugoio-card-banner.png"
thumb = "/images/gohugoio-card-thumb.png"
+++

Com es pot apreciar des d'aquesta setmana aquesta humil pàgina web s'ha remodelat una mica tant visualment com internament, i és que no només hi ha nous colors, imatges i seccions, sinó que també ofereix tot el seu contingut en 2 nous idiomes! M'he decidit a fer aquest pas perquè primer de tot volia provar com funcionava el tema dels multiidiomes en Hugo i també per intentar fer més còmoda la lectura dels articles a la gent que la visita, sense que l'idioma fos un obstacle i oferint el major confort i plaer als lectors.

Els idiomes com podeu veure a la barra superior són el Castellà i el Català. Així que per canviar l'idioma en el que esteu veient la pàgina, és tan senzill com escollir al gestor quin idioma prefereixes i automàticament es traduirà tot. Si trobeu alguna errada en la traducció o algun lloc que no està traduïda per favor Poseu-me un comentari en el post en qüestió o comenta-pels meus xarxes socials (links a la part baixa de la web).

Després d'aquesta "xapa", veurem com es podeu tenir els vostres llocs en Hugo en diversos idiomes de forma fàcil, senzilla i per a tota la família. Som-hi!

## Configura Idiomes

El primer que cal fer per tenir un lloc multilingüe, és definir en el `config.toml` els idiomes que es volen oferir. En el meu cas he decidit anglès, castellà i català de la manera següent:
```vim
[Languages]
[Languages.en]
languageName = "English"
weight = 1

[Languages.es]
languageName = "Spanish"
weight = 2

[Languages.ca]
languageName = "Catalan"
weight = 3
```
El `languageName` s'utilitza per definir el text que es veurà a la web al comprovar quins idiomes hi ha disponibles. Spoiler alert! Més endavant veurem com traduir també aquests textos.

## Menús

Per traduir els menús en els diferents idiomes s'han de declarar de la forma següent:
```vim
[[languages.en.menu.main]]
name = "home"
url = "/"

[[languages.en.menu.main]]
name = "about me"
url = "/about"

[[languages.es.menu.main]]
name = "inicio"
url = "/"

[[languages.es.menu.main]]
name = "sobre mí"
url = "/about"

[[languages.ca.menu.main]]
name = "inici"
url = "/"

[[languages.ca.menu.main]]
name = "sobre mi"
url = "/about"
```

## Contingut

Si per exemple volem traduir la pàgina `Sobre mí`, podem fer-ho simplement amb replicar aquest fitxer tantes vegades com idiomes tinguem, en aquest cas 3, afegint l'ISO de l'idioma en el nom de la següent manera:
```vim
/content/about.en.md
/content/about.es.md
/content/about.ca.md
```
En el nostre cas l'idioma anglès és el per defecte, de manera que fins i tot podríem fer-ho tal que així:
```vim
/content/about.md
/content/about.es.md
/content/about.ca.md
```

## Contingut traduït

Per trobar les traduccions de la pàgina en concret es pot fer servir el tros de codi proporcionat en la documentació oficial:
```go
{{If .IsTranslated}}
<H4> {{i18n "translations"}} </ h4>
<Ul>
    {{Range .Translations}}
    <Li>
        <a href="{{ .Permalink }}"> {{.Lang}}: {{.Title}} {{if .IsPage}} ({{i18n "wordCount".}}) {{end}} < / a>
    </ Li>
    {{End}}
</ Ul>
{{End}}
```

A la plantilla on inserim aquest codi, un cop es renderitzi el contingut per aquesta, apareixerà si hi ha traducció o no d'aquest contingut.

## Traducció de textos

En el codi anterior ja podem veure que apareix la funció `i18n` que Hugo utilitza per traduir els textos definits en els arxius d'idiomes dins el directori arrel com `/ i18n`. El format dels arxius de dins ha de ser per exemple:
```vim
i18n/en.toml
i18n/es.toml
i18n/ca.toml
```
Per a cada idioma anteriorment descrit respectivament.

El contingut de l'arxiu serà semblant a:
```toml
[readMore]
other = "Llegir més"
```
Per l'arxiu en anglès.
```toml
[readMore]
other = "Llegir més"
```
Per l'arxiu en castellà.
```toml
[readMore]
other = "Llegir més"
```
Per l'arxiu en català.

Un cop definida la traducció per `Llegir més`, s'utilitza en la nostra plantilla d'Hugo com:
```go
{{i18n "readMore"}}
```

I el resultat serà el text definit en els `.toml` segons l'idioma escollit per l'usuari per veure la pàgina web.

## Traducció singular i/o plural

Es poden definir traduccions singulars o plurals depenent d'un "comptador", ja que la funció `i18n` ofereix aquesta possibilitat. Per exemple per al `Temps de lectura` d'un article, podem definir-lo tal que així en el `.toml`:
```toml
[readingTime]
one = "One minute to read"
other = "{{.Count}} minutes to read"
```

Veiem que li passem el `.Count` a la traducció pel que haurem de invocar la funció de la següent manera:
```go
{{i18n "readingTime" .ReadingTime}}
```
> Nota: la propietat `.ReadingTime` és un comptador que retorna Hugo segons el nombre de paraules dels articles que creiem.

## Referències
 
Per a més detalls consulteu la pàgina oficial de la [documentació d'Hugo](https://gohugo.io/content-management/multilingual/).