+++
title = "Cómo tener un sitio web multilingüe con Hugo"
date = "2021-02-05"
author = "charly3pins"
description = "Conoce las configuraciones y los trucos para convertir tu sitio web en un sitio multilingüe en solo unos pocos pasos."

tags = ["hugo"]

image = "/images/gohugoio-card.png"
+++
Como se puede apreciar desde esta semana esta humilde página web se ha remodelado un poco tanto visualmente como internamente, y es que no solo hay nuevos colores, imágenes y secciones, sino que también ¡ofrece todo su contenido en 2 nuevos idiomas! Me he decidido en hacer este paso porqué primero de todo quería probar como funcionaba el tema de los multilingües en Hugo y también para intentar hacer más cómoda la lectura de los artículos a la gente que la visita, sin que el idioma fuera un obstáculo y ofreciendo el mayor confort y placer a los lectores.

Los idiomas como podéis ver en la barra superior son el Castellano y el Catalán. Así que para cambiar el idioma en el que estáis viendo la página, es tan sencillo como escoger en el selector qué idioma prefieres y automáticamente se traducirá todo. Si encontráis alguna errata en la traducción o alguna parte que no está traducida por favor ponedme un comentario en el post en cuestión o comentalo por mis redes sociales (links en la parte baja de la web).

Tras esta "chapa", vamos a ver como se podéis tener vuestros sitios en Hugo en varios idiomas de forma fácil, sencilla y para toda la familia. ¡Vamos allá!

## Configurar Idiomas

Lo primero que hay que hacer para tener un sitio multilingüe, es definir en el `config.toml` los idiomas que se quieren ofrecer. En mi caso he decidido inglés, castellano y catalán de la siguiente forma:
```vim
[languages]
[languages.en]
languageName = "English"
weight = 1

[languages.es]
languageName = "Spanish"
weight = 2

[languages.ca]
languageName = "Catalan"
weight = 3
```
El `languageName` se utiliza para definir el texto que se verá en la web al comprobar qué idiomas hay disponibles. ¡Spoiler alert! Más adelante veremos cómo traducir también estos textos.

## Menús

Para traducir los menús en los diferentes idiomas se deben declarar de la siguiente forma:
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

## Contenido

Si por ejemplo queremos traducir la página de `Sobre mí`, podemos hacerlo simplemente con replicar dicho fichero tantas veces como idiomas tengamos, en este caso 3, añadiendo el ISO del idioma en el nombre de la siguiente forma:
```vim
/content/about.en.md
/content/about.es.md
/content/about.ca.md
```
En nuestro caso el idioma inglés es el por defecto, por lo que incluso podríamos hacerlo tal que así:
```vim
/content/about.md
/content/about.es.md
/content/about.ca.md
```

## Contenido traducido

Para encontrar las traducciones de la página en concreto se puede usar el trozo de código proporcionado en la documentación oficial:
```go

{{ if .IsTranslated }}
<h4>{{ i18n "translations" }}</h4>
<ul>
    {{ range .Translations }}
    <li>
        <a href="{{ .Permalink }}">{{ .Lang }}: {{ .Title }}{{ if .IsPage }} ({{ i18n "wordCount" . }}){{ end }}</a>
    </li>
    {{ end }}
</ul>
{{ end }}
```

En la plantilla donde insertemos este código, una vez se renderice el contenido para ésta, aparecerá si hay traducción o no de ese contenido.

## Traducción de textos

En el código anterior ya podemos ver que aparece la función `i18n` que Hugo utiliza para traducir los textos definidos en los archivos de idiomas dentro del directorio raíz como `/i18n`. El formato de los archivos de dentro debe ser por ejemplo:
```vim
i18n/en.toml
i18n/es.toml
i18n/ca.toml
```
Para cada idioma anteriormente descrito respectivamente.

El contenido del archivo será parecido a:
```toml
[readMore]
other = "Read more"
```
Para el archivo en inglés.
```toml
[readMore]
other = "Leer más"
```
Para el archivo en castellano.
```toml
[readMore]
other = "Llegir més"
```
Para el archivo en catalán.

Una vez definida la traducción para `Leer más`, se utiliza en nuestra plantilla de Hugo como:
```go
{{ i18n "readMore" }}
```

Y el resultado será el texto definido en los `.toml` según el idioma escogido por el usuario para ver la página web.

## Traducción singular y/o plural

Se pueden definir traducciones singulares o plurales dependiendo un "contador", ya que la función `i18n` ofrece esa posibilidad. Por ejemplo para el `Tiempo de leído` de un artículo, podemos definirlo tal que así en el `.toml`:
```toml
[readingTime]
one = "One minute to read"
other = "{{.Count}} minutes to read"
```

Vemos que le pasamos el `.Count` a la traducción por lo que tendremos que invocar la función de la siguiente forma:
```go
{{ i18n "readingTime" .ReadingTime }}
```
> Nota: la propiedad `.ReadingTime` es un contador que retorna Hugo según el número de palabras de los artículos que creemos.

## Referencias
 
Para más detalles consultar la página oficial de la [documentación de Hugo](https://gohugo.io/content-management/multilingual/).
