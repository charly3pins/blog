+++
title = "Construint un bloc estàtic amb Hugo"
date = "2018-09-22"
author = "charly3pins"
description = "Passos ràpids per crear el vostre propi bloc estàtic amb Hugo i instal·lar un tema del catàleg. Després, empenyeu el vostre lloc a GitHub i implementeu-lo amb GitHub Pages."

slug = "Construint un bloc estàtic amb Hugo"
tags = ["hugo", "cms", "github"]

image = "/images/gohugoio-card.png"
banner = "/images/gohugoio-card-banner.png"
thumb = "/images/gohugoio-card-thumb.png"
+++
Si voleu crear un lloc web estàtic ràpid us recomano [Hugo](https://gohugo.io/). Està escrit a Go i és realment útil per configurar i adaptar-se a les vostres necessitats. A més, podeu triar a través de diferents [temes](https://themes.gohugo.io/) creats per l’equip i altres per la comunitat o fins i tot crear el vostre propi.

Aquí explicaré en alguns passos com crear un bloc amb Hugo i com allotjar-se i desplegar-se a GitHub i GitHub Pages. Si necessiteu més detalls, visiteu els [documents Hugo oficials](https://gohugo.io/documentation/).

## Inici
Primer de tot, heu d’instal·lar Hugo, en el meu cas amb [Homebrew](https://brew.sh/):
```vim
brew install hugo
```

Comproveu la versió instal·lada:
```vim
hugo version
```

## Crea un lloc
Un cop hàgiu instal·lat Hugo, podreu crear el vostre lloc web mitjançant l'ordre:
```vim
hugo new site your-blog-name
```

Després d'això, veureu una nova carpeta anomenada `your-blog-name` i, si mireu a l'interior, veureu l'arbre següent:
![Folder tree](/images/build-hugo-static-blog/folder-tree-your-blog-name.png)

* Archetypes són fitxers de plantilla de contingut per al vostre projecte, que s'utilitzen quan s'executa l'ordre `hugo new`.
* Content és on s’emmagatzemen totes les publicacions i pàgines. La mateixa estructura d’aquesta carpeta s’utilitzarà per organitzar els URL del vostre lloc renderitzat.
* Data són una carpeta per emmagatzemar dades addicionals per generar el vostre lloc.
* Layouts és la carpeta on s'emmagatzema la plantilla del vostre lloc si no utilitzeu un tema.
* Static emmagatzema tots els fitxers estàtics del vostre lloc.
* Themes són on s’emmagatzemen els temes que instal·leu.
* config.toml emmagatzema la configuració principal del vostre lloc.

## Instal·la el tema
Si voleu utilitzar un tema ja creat, podeu fer-ho de dues maneres. Per comprovar els temes existents, visiteu el lloc web oficial de [Temes d'Hugo](https://github.com/panr/hugo-theme-hello-friend) on podeu veure una demostració de cadascun.

Primer de tot, heu d'iniciar un repositori de git dins del vostre projecte:
```vim
cd your-blog-name;\
git init;
```

A continuació, podeu clonar la reposició a la carpeta `themes`:
```vim
git clone https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend
```

Si no voleu fer cap canvi, és millor incloure el tema com a submòdul git i podeu obtenir noves actualitzacions quan estiguin disponibles. Feu-ho amb:
```vim
git submodule add https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend
```

## Crea contingut
Per generar la vostra primera publicació al bloc, podeu utilitzar l'ordre `hugo new` i establir el camí que vulgueu, en el meu cas` publicacions`:
```vim
hugo new posts/my-first-post.md
```
Obtindreu el fitxer següent:
![Example post](/images/build-hugo-static-blog/example-post.png)

La primera secció és per a paràmetres i la segona per al contingut en aquest cas en el marcatge. Consulteu aquest [Full de trucs de Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) com a referència i aparador ràpid.

## Executeu el vostre lloc
Un cop hàgiu creat la publicació, podeu crear el vostre lloc mitjançant l'ordre `hugo server`. La bandera `-D` és per als esborranys de renderització:
```vim
hugo server -D
```
I apareixeran els registres de representació i, al final, un missatge similar a:
```vim
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```
Copieu l'URL al navegador i veureu el vostre lloc en funcionament.

## Host a GitHub
Utilitzarem les pàgines d'usuari/organització `https://<USERNAME|ORGANIZATION>.github.io/`.

Creeu un dipòsit `<YOUR-PROJECT>` a GitHub. Aquest dipòsit inclourà el contingut d’Hugo i altres fitxers font.

Creeu un dipòsit GitHub `<USERNAME>.github.io`. Aquest és el dipòsit que contindrà la versió totalment renderitzada del vostre lloc web Hugo.

```vim
git clone https://github.com/<USERNAME>/<YOUR-PROJECT>
cd <YOUR-PROJECT>
```

Executeu el vostre lloc web localment mitjançant l'ordre `hugo server` o si feu servir el tema `hugo server -t <THEME_NAME>`. Seguiu les instruccions de la consola per accedir-hi. El servidor web hauria d’estar disponible a http://localhost:1313/

Finalment, haureu d'afegir el repositori `<USERNAME>.github.io` dins de la carpeta `public` com a submòdul git per tal d'actualitzar el vostre lloc web un cop el regeneu.

```vim
git submodule add -b master git@github.com:<USERNAME>/<USERNAME>.github.io.git public
```

Si no teniu configurada la clau de parell RSA, haureu d'afegir el submòdul mitjançant HTTP:

```vim
git submodule add -b master https://github.com/<USERNAME>/<USERNAME>.github.io.git public
```

Per automatitzar els passos següents, podeu desar-lo a `deploy.sh`. Recordeu fer-lo executable amb:
```vim
chmod +x deploy.sh
```

deploy.sh
```shell
#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project.
hugo # if using a theme, replace with `hugo -t <YOURTHEME>`

# Go To Public folder
cd public
# Add changes to git.
git add .

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Come Back up to the Project Root
cd ..
```