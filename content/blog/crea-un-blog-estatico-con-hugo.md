+++
title = "Crea un blog estático con Hugo"
date = "2018-09-22"
author = "charly3pins"
description = "Pasos para crear su propio blog estático con Hugo e instalar un tema del catálogo. Después de eso, sube tu sitio we a GitHub y publicalo usando GitHub pages."

tags = ["hugo",  "github"]

image = "/images/gohugoio-card.png"
+++
Si quieres crear un sitio web estático rápido te recomiendo [Hugo](https://gohugo.io/). Está escrito en Go y es muy útil para configurar y adaptarse a sus necesidades. Además, puedes elegir entre diferentes [temas](https://themes.gohugo.io/) creados por el equipo y otros por la comunidad o incluso crear uno propio.

Aquí explicaré en algunos pasos cómo crear un blog con Hugo y cómo ser alojado e implementado en GitHub y GitHub Pages. Si necesita más detalles visite los [documentos de Hugo] oficiales (https://gohugo.io/documentation/).

## Inicio
Primero que nada necesitas instalar Hugo, en mi caso usando [Homebrew](https://brew.sh/):
```vim
brew install hugo
```

Verifique la versión instalada:
```vim
hugo version
```

## Crear sitio
Una vez que haya instalado Hugo, podrá crear su sitio web usando el comando:
```vim
hugo new site your-blog-name
```

Después de eso, verá una nueva carpeta llamada `your-blog-name` y si mira dentro verá el siguiente árbol:
![Folder tree](/images/build-hugo-static-blog/folder-tree-your-blog-name.png)

* Archetypes son archivos de plantilla de contenido para su proyecto, que se utilizan cuando ejecuta el comando `hugo new`.
* Content es donde se almacenan todas las publicaciones y páginas. La misma estructura en esta carpeta se utilizará para organizar las URL en su sitio renderizado.
* Data es una carpeta para almacenar datos adicionales para generar su sitio.
* Layouts es la carpeta donde se almacena la plantilla de tu sitio si no estás usando un tema.
* Static almacena todos los archivos estáticos de su sitio.
* Themes es donde se almacenan los temas que instalas.
* config.toml almacena la configuración principal de su sitio.
  
## Instalar el tema
Si quieres utilizar un tema ya creado puedes hacerlo de dos formas. Para comprobar los temas existentes, visite el sitio web oficial de [temas de Hugo](https://github.com/panr/hugo-theme-hello-friend) donde puede ver una demostración de cada uno.

En primer lugar, debe iniciar un repositorio de git dentro de su proyecto:
```vim
cd your-blog-name;\
git init;
```

Luego puede clonar el repositorio dentro de la carpeta `themes`:
```vim
git clone https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend
```

Si no desea realizar ningún cambio, es mejor incluir el tema como un submódulo de git y puede obtener nuevas actualizaciones cuando estén disponibles. Hágalo con:
```vim
git submodule add https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend
```

## Crear contenido
Para generar su primera publicación de blog, puede usar el comando `hugo new` y establecer la ruta que desee, en mi caso `posts`:
```vim
hugo new posts/my-first-post.md
```
Obtendrá el siguiente archivo:
![Example post](/images/build-hugo-static-blog/example-post.png)

La primera sección es para los parámetros y la segunda es para el contenido en este caso en markdown. Consulte esta [Hoja de referencia de Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) una referencia rápida y un escaparate.

## Ejecute su sitio
Una vez que haya creado la publicación, puede construir su sitio usando el comando `hugo server`. La bandera `-D` es para renderizar borradores:
```vim
hugo server -D
```
Y aparecerán los registros de renderizado y al final un mensaje similar a:
```vim
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```
Copie la URL en su navegador y verá su sitio en funcionamiento.

## Host en GitHub
Usaremos las páginas de usuario / organización `https://<USERNAME|ORGANIZATION>.github.io/`.

Cree un repositorio `<YOUR-PROJECT>` en GitHub. Este repositorio contendrá el contenido de Hugo y otros archivos fuente.

Cree un repositorio de GitHub `<USERNAME>.github.io`. Este es el repositorio que contendrá la versión completamente renderizada de su sitio web Hugo.

```vim
git clone https://github.com/<USERNAME>/<YOUR-PROJECT>
cd <YOUR-PROJECT>
```

Ejecute su sitio web localmente usando el comando `hugo server` o si está usando el tema `hugo server -t <THEME_NAME>`. Siga las instrucciones en la consola para acceder a él. El servidor web debe estar disponible en http: // localhost: 1313 /

Finalmente, debe agregar el repositorio `<USERNAME>.github.io` dentro de la carpeta `public` como un submódulo de git para actualizar su sitio web una vez que lo regenere.

```vim
git submodule add -b master git@github.com:<USERNAME>/<USERNAME>.github.io.git public
```

Si no tiene configurada la clave de par RSA, deberá agregar el submódulo a través de HTTP:

```vim
git submodule add -b master https://github.com/<USERNAME>/<USERNAME>.github.io.git public
```

Para automatizar los siguientes pasos, puede guardarlo en `deploy.sh`. Recuerde hacerlo ejecutable con:
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