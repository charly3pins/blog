+++
title = "Sube el nivel de tus presentaciones con Go"
date = "2020-10-06"
author = "charly3pins"
description = "Genera fácilmente tus presentaciones con \"present\", la herramienta impulsada por Go que genera y renderiza tus diapositivas."

tags = ["go", "life"]

image = "/images/level-up-your-presentations-with-go/GOPHER_MIC_DROP_WITH_BACKGROUND.png"
+++
Si es una persona técnica y no te gusta luchar con los programas de presentación pero quiere / necesita crear uno, enhorabuena! estás en el lugar correcto. Sé que, como ingenieros de software, queremos codificar, leer o mirar cosas relacionadas con software, arquitectura o devops, pero no con presentaciones. A veces, se nos exige que presentamos algo a otros miembros del equipo, a los propietarios de productos o incluso más aterradores, al equipo directivo.

Por este motivo, quiero presentaros el paquete [present](https://godoc.org/golang.org/x/tools/present) de Go. Se utiliza para crear diapositivas a Golang alojadas en discussions.golang.org o tu privada. La he utilizado varias veces, sobre todo cuando quiero compartir algo con mis compañeros del equipo (algún código, claro), porque no quiero perder el tiempo con los programas. Acabo de crear el proyecto para las diapositivas, añado mis diapositivas a la marca, añado las imágenes necesarias y las presento. Veamos detalladamente cómo funciona!

Suponiendo que tiene Go [instalado](https://golang.org/doc/install) y configurado correctamente, todo lo que debe instalar es el paquete con el siguiente orden:
```vim
go get -u golang.org/x/tools/present
```

Comprueba si funciona escribiendo:
```vim
present
```

Debería de mostrar un mensaje similar a:
```vim
2020/10/04 23:23:54 Open your web browser and visit http://127.0.0.1:3999
```

Por lo tanto, puede visitar el enlace y ver el servidor local preparado para alojar sus presentaciones. Increíble, ¿o no? De acuerdo, sé que desea mostrar algo que no sea un directorio vacío, así que vamos a crear un ejemplo de presentación para ello.

## Formato

Cree un directorio para las diapositivas:
```vim
mkdir go-present-example
cd go-present-example/
```

Cree la primera diapositiva:
```vim
vim initial.slide
```

Y añada el siguiente contenido:
```
Learning Go present
6 October 2020

Crash Bandicoot
crash.bandicoot@gmail.com

* Hello World

I'm a slide
```

Por lo tanto, si vuelve a ejecutar el comando `present` dentro de su carpeta y va de nuevo al navegador debería ver la pantalla siguiente:
![initial slide](/images/level-up-your-presentations-with-go/initial-slide.jpeg)

Haga clic en el enlace `initial.slide` y admire su presentación.
![initial presentation](/images/level-up-your-presentations-with-go/initial-presentation.jpeg)

Como puede ver, la primera línea es el título, la segunda la fecha y luego la sigue el autor. En la segunda diapositiva, en realidad la primera, aparece el título de la diapositiva y el texto de la misma. El último muestra un título de agradecimiento y su nombre y contacto (correo electrónico, twitter, etc.) que ha agregado a la diapositiva. Ver a continuación:
![end presentation](/images/level-up-your-presentations-with-go/end-presentation.jpeg)

## Sintaxis heredada del comando present

Es compatible con Markdown, pero aquí exploraremos la [sintaxis heredada de present](https://godoc.org/golang.org/x/tools/present#hdr-Legacy_Present_Syntax), ya que el Markdown tiene muchos recursos sobre cómo comprobar. Así que vamos a explorar un poco las funciones que ofrece "presente" para formatear y añadir texto a nuestros diapositivas.

Primero son las opciones clásicas para formatear el texto:
```text
normal vs `highlighted`
*bold*
_italic_
*multiple*bold*text*
_multiple_italic_text_
```

Y el resultado es:
![text formatting](/images/level-up-your-presentations-with-go/text-formatting.jpeg)

También se puede añadir una lista:
```text
Grocery list for the gopher:

- go routines
- garbage collector
- Rust
```
![text formatting list](/images/level-up-your-presentations-with-go/text-formatting-list.jpeg)

O un nivel diferente de subsecciones así:
```
** Subsection

Gopher is diving the subsection.

*** Sub-subsection

Another Gopher is diving more into the sub-subsection!
```

Y verá la diapositiva como esta locura:
![text formatting subsections](/images/level-up-your-presentations-with-go/text-formatting-subsections.jpeg)

![gophers](/images/level-up-your-presentations-with-go/gophers.gif)

## Invocaciones de comandos

Aparte del formato de texto, hay una [invocaciones de comandos especiales](https://godoc.org/golang.org/x/tools/present#hdr-Command_Invocations) que puede invocar para llevar su presentación a otro nivel.

### imágenes y vídeos

El comando `.image` inyecta una imagen en la diapositiva. Acepta 1 o 3 argumentos (nombre, altura, anchura). El nombre es obligatorio, los otros dos deben estar presentes o sustituidos por un `_`.
```text
.image /images/gopher.jpeg 200 200
.image /images/gopher.jpeg _ 300
```

![images](/images/level-up-your-presentations-with-go/images.jpeg)

Al igual que las imágenes, puede hacer lo mismo con un vídeo mediante el comando `.video`. Acepta 2 o 4 argumentos (nombre, tipo de contenido del archivo, altura, anchura). El nombre y el tipo de contenido del archivo son obligatorios; los otros dos deben estar presentes o sustituidos por y `_`.
```text
.video videos/gopher-dance.mp4 video/mp4 400 600
.video videos/gopher-dance.mkv video/mkv 500 _
```

De manera similar a las imágenes, también tiene el pedido `.background` para configurar la imagen de fondo de una diapositiva. Sólo tiene un argumento como nombre de archivo de la imagen.
```text
.background images/susan.jpg
```

### enlaces
Si va a insertar un enlace a la presentación, puede utilizar la orden `.link`. Acepta 1 o 2 argumentos (URL HTTP, etiqueta de texto). La URL HTTP es obligatorio, el segundo es opcional.
```text
.link https://charly3pins.dev charly3pins website
.link https://charly3pins.dev
```

![links](/images/level-up-your-presentations-with-go/links.jpeg)


### código
El mejor comando en mi opinión es `.code`. Le permite poner código extraído de los archivos fuente y inyectarles como bloques <pre> escapados por HTML. Acepta un argumento como nombre de archivo seguido de una dirección opcional que especifica qué sección del archivo se mostrará.

Por ejemplo, tomando Hello world a Go como código fuente:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!")
}
```

Debemos especificar como:
```text
.code hello.go
```

Y se mostrará así:
![code](/images/level-up-your-presentations-with-go/code.jpeg)

Pero, ¿qué ocurre si desea resaltar alguna parte del código? No se preocupe, presente tiene este "presente" y puede añadir las "direcciones opcionales" que hemos comentado a continuación. Por lo tanto, cambie el código así para resaltar la llamada `Printf`:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!") // HL
}
```
Y utilice el mismo comando en la diapositiva:
```text
.code hello-hl.go
```

Para ver el código resaltado:
![code-hl](/images/level-up-your-presentations-with-go/code-hl.jpeg)

Un paso más! Si sólo desea mostrar una parte de su código, por ejemplo, ocultar el paquete y las importaciones de archivo, también puede agregar los siguientes fragmentos:
```go
package main

import "fmt"

//START OMIT
func main() {
	fmt.Println("Hello world!") // HL
}
//END OMIT
```
Vuelva a utilizar el mismo comando pero añadiendo el siguiente fragmento:
```text
.code hello-hl-partial.go /START OMIT/,/END OMIT/
```

Y véase el código parcialmente mostrado:
![code-hl-partial](/images/level-up-your-presentations-with-go/code-hl-partial.jpeg)

#### play

Esto comando es superpotente para ayudarle a presentar algún código y resaltar u ocultar algunas partes. Pero el espectáculo debe continuar y la mejor parte es la siguiente. El comando `.play` es como el del `.code`, pero pone un botón a la fuente descatalogada y puede ejecutar el programa desde el navegador. Es magia o no?
![magic](/images/level-up-your-presentations-with-go/magic.gif)

Utilizamos el mismo código fuente que estamos utilizando y añadimos el nuevo comando en las diapositivas así:
```text
.play hello.go
```

Aparecerá como el del "código", pero si observa en el extremo inferior derecho, aparecerá un pequeño botón `Run`.
![code-play](/images/level-up-your-presentations-with-go/code-play.jpeg)

Al ejecutar el código se mostrará una pequeña ventana negra en la pantalla donde se mostrará la salida del código:
![code-played](/images/level-up-your-presentations-with-go/code-played.jpeg)

## Notas del presentador

Por último, pero no menos importante, es algo interesante que también proporcionan. Es bien sabido que los programas de PowerPoint o similares puede añadir sus notas sólo para vosotros cuando presentas la presentación ya veces son muy útiles. Así pues, "presente" también lo tiene en cuenta y puedes añadir tus notas de presentación sólo añadiendo un `:` al comienzo de la frase y este texto se tratará como una nota de presentador.

Por ejemplo:
```text
* Presenter notes

The gophers like to eat a lot.

: they eat more than half their body weight in food each day

They eat basically plants.

: typically gnaws the roots of a plant just beneath the soil, so the damage isn’t seen
```
![present-notes](/images/level-up-your-presentations-with-go/present-notes.jpeg)


Como puede ver, las notas no están presentes, ¿por qué? Porque necesita ejecutar la presentación en un "presentador" así.
```vim
present -notes
```

Y debería mostrar un mensaje similar a:
```vim
2020/10/04 23:23:54 Open your web browser and visit http://127.0.0.1:3999
2020/10/04 Notes are enabled, press 'N' from the browser to display them.
```

Por lo tanto, si actualiza el navegador con la presentación y pulse `N`, verá una ventana emergente que muestra las notas de cada diapositiva en la parte inferior de la siguiente manera:
![present-notes-popup](/images/level-up-your-presentations-with-go/present-notes-popup.jpeg)

## Conclusión

La herramienta `present` es muy útil para presentaciones técnicas, especialmente en Go. Tiene limitaciones como el formato de las diapositivas y el posicionamiento de la imagen a veces difícil, pero en general es un paquete fantástico y para mí es el estándar de todas mis presentaciones. Si desea profundizar en este paquete, consulte la [documentación oficial](https://godoc.org/golang.org/x/tools/present) y también os recomendaría la [presentación](https://discussions.golang.org/2012/insidepresent.slide#1): `Inside the" presente "tool` de Andrew Gerrand. También he colgado el código fuente de este tutorial en [GitHub](https://github.com/charly3pins/go-present-example).
