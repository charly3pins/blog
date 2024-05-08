+++
title = "He generado mi CV usando Go templates"
date = "2023-09-23"
author = "charly3pins"
description = "Cómo utilizar las plantillas Go para generar páginas HTML y aprovecharlas al máximo."

tags = ["go"]

image = "/images/gopher-welder.svg"
+++

## Introducción

Si necesita presentar cualquier tipo de datos de forma estructurada y formateada, este artículo puede resultarle interesante. Go proporciona una manera de hacer esto de una manera fácil y efectiva con dos paquetes, `text/template` y `html/template`. El primero está enfocado a formatear textos en general y lo estoy usando para generar mi página README en GitHub. Puede encontrar los detalles en [https://github.com/charly3pins/charly3pins](https://github.com/charly3pins/charly3pins). En este artículo, cubriré el segundo, las plantillas para páginas HTML. Es cierto que al final generaré un PDF a partir de él pero ¡vamos paso a paso!
Te recomiendo que leas la [página de documentación](https://pkg.go.dev/html/template) ya que no voy a cubrir los porqués y los qués del paquete, solo te mostraré cómo organicé las plantillas y cómo genero mi Currículum usándolo.

## Plantilla CV

En primer lugar, creé un archivo YAML donde almacenaré toda la información de mi CV llamado `me.yaml`. La estructura que elegí fue la siguiente:

```yaml
Name:
Role:
Email:
Web:
Location:

Mission:

Skills:

Experience:
  - Role:
    Entity:
    Started:
    Stopped:
    Location:
    Details:

Projects:

Education:

Languages:

Keywords:
```

(Eliminé todos los datos para que sean legibles, pero puedes hacerte una idea de lo que hay dentro de cada clave).

Después de eso, comencé a crear la plantilla base para la página HTML que quería generar. Lo guardé dentro de `tmpl/base.html`

```html
{{ define "base" }}
<!doctype html>
<html lang="en-US">
  <head>
    <title>{{.Name}} | {{.Role}}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <main></main>
  </body>
</html>
{{ end }}
```

Esta es solo la base, por lo que aún no se muestran datos, solo el Nombre y el Rol.

Por razones de mantenimiento, dividí cada sección de mi CV en una plantilla parcial. Todas las plantillas parciales las almacené dentro de `tmpl/partials/`. Entonces, por ejemplo, creé `about.html` que es tan simple como:

```html
<div id="about">
  <h1 id="name" style="grid-area: name">{{.Name}}</h1>
  <div id="role" style="grid-area: role">{{.Role}}</div>
  <div id="contact" style="grid-area: contact">
    <a href="mailto:{{.Email}}">{{.Email}}</a> • <a href="{{.Web}}">{{.Web}}</a>
  </div>
</div>
```

Y otros con más lógica como `experience.html`:

```html
<div id="experience">
  <h2>Experience</h2>
  {{ range .Experience }}
  <div class="employer">
    <div class="role">
      <div><strong>{{.Role}}</strong></div>
      <div class="dates">
        {{.Started}} - {{if .Stopped}}{{.Stopped}}{{else}}Present{{end}}
      </div>
    </div>
    <div class="entity">
      {{.Entity}} <span class="loc">({{.Location}})</span>
    </div>
  </div>

  <ul class="deets">
    {{ range .Details }}
    <li class="deet">{{- . -}}</li>
    {{end}}
  </ul>
</div>
{{end}}
```

Después de crear todos los necesarios, los agregué dentro del base creado antes de usar la acción `{{template}}` para invocar los parciales en el lugar que deseaba. El `base.html` resultante se ve así:

```html
{{ define "base" }}
<!doctype html>
<html lang="en-US">
  <head>
    <title>{{.Name}} | {{.Role}}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <main>
      {{ template "about.html" . }} {{ template "mission.html" . }}
      <br />
      {{ template "skills.html" . }}
      <br />
      {{ template "experience.html" . }}
      <br />
      {{ template "projects.html" . }}
      <br />
      {{ template "education.html" . }}
      <br />
      {{ template "keywords.html" . }}
      <br />
      {{ template "languages.html" . }}
    </main>
  </body>
</html>
{{ end }}
```

Yo he elegido este orden pero puedes pedir los parciales como quieras y repetirlos tantas veces como quieras, no hay ninguna limitación al respecto.

## Generando la página HTML

¡Perfecto! En este punto, tenemos nuestra "Base de datos" en nuestro archivo YAML, y tenemos nuestra plantilla base invocando nuestras plantillas parciales, por lo que el único punto que nos falta es combinar los datos con las plantillas y generar nuestra página HTML para tener nuestro CV. publicado.

Creé un `main.go` en la raíz del proyecto y agregué el siguiente código:

```go
package main

import (
	"log"
	"os"
	"html/template"

	"gopkg.in/yaml.v3"
)

const (
	datafileName   = "me.yaml"
	resumeFileName = "resume.html"
)

func main() {
	files := []string{
		"./tmpl/base.html",
		"./tmpl/partials/about.html",
		"./tmpl/partials/education.html",
		"./tmpl/partials/experience.html",
		"./tmpl/partials/keywords.html",
		"./tmpl/partials/languages.html",
		"./tmpl/partials/mission.html",
		"./tmpl/partials/projects.html",
		"./tmpl/partials/skills.html",
	}

	templates, err := template.ParseFiles(files...)
	if err != nil {
		log.Print(err.Error())
		return
	}

	data := map[string]interface{}{}
	buf, err := os.ReadFile(datafileName)
	if err != nil {
		log.Println("err reading data file", err)
		return
	}
	err = yaml.Unmarshal(buf, &data)
	if err != nil {
		log.Println("err unmarshaling data", err)
		return
	}

	out, err := os.Create(resumeFileName)
	if err != nil {
		log.Println("error creating file", resumeFileName, err)
		return
	}
	err = templates.ExecuteTemplate(out, "base", data)
	if err != nil {
		log.Print(err.Error())
	}
}
```

Utilicé la biblioteca `gopkg.in/yaml.v3` para trabajar con YAML fácilmente, pero probablemente puedas encontrar otras que sirvan a tu propósito, pero estoy acostumbrado a trabajar con esta.

Luego declaré las constantes para los nombres de archivos YAML y HTML.

Después de eso, dentro de `main()` tengo ese segmento de cadenas donde indico todas mis plantillas y su ruta. Creo que esto se puede simplificar en el futuro usando otra función del paquete, pero por ahora quería que fuera lo más simple posible.

El siguiente paso es analizar los archivos que quiero usar como plantillas. El paquete proporciona la función `func (t *Template) ParseFiles(filenames...string) (*Template, error)`, así que simplemente le pasé mi segmento y luego todas las plantillas están listas para usarse en cualquier momento.

La otra parte que necesitaba era analizar el archivo YAML y para eso, simplemente leí el archivo donde tengo toda la información y luego usé la biblioteca mencionada antes de descomponerlo en una `interfaz de mapa[cadena]{}{}`.

Una vez analizadas las plantillas y cargada la información, el tercer archivo que llega al juego de mesa es el HTML final. Acabo de usar la función `func Create(name string) (*File, error)` para crear eso.

Por último pegué todas las partes con el executino de la plantilla con la siguiente función `func (t *Template) ExecuteTemplate(wr io.Writer, name string, data any) error`

- El primer argumento es `io.Writter`, por lo que nuestro archivo HTML.
- El segundo es el nombre de la plantilla que queremos ejecutar. En nuestro caso solo definimos una plantilla (aunque creamos múltiples parciales, solo definimos la `base` con el comando `{{ define "base" }}`).
- El último son los datos que queremos pasar (si los hay) a nuestra plantilla, es decir, nuestro archivo YAML cargado.

Para generar el archivo `resume.html`, ejecuto desde el directorio raíz:

```go
go run main.go
```

## Conclusión

Espero que este fácil y sencillo ejemplo te haya ayudado a aprender o ampliar tus conocimientos en el uso de plantillas en Go y que te haya dado ideas de cómo generar tus páginas en HTML o en texto para formatear tus textos de forma organizada y estructurada. manera sin tener que preocuparse de nada más allá de generar la plantilla y la estructura de datos para satisfacer dicha plantilla.

Puedes encontrar el código fuente completo en [https://github.com/charly3pins/cv](https://github.com/charly3pins/cv) donde agregué algo de CSS y cosas más sofisticadas para mejorar virtualmente el Currículum y donde agregaré actualizaciones en el futuro.

Espero que haya quedado claro todo lo que he intentado explicar en este post, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantado de responderte.
