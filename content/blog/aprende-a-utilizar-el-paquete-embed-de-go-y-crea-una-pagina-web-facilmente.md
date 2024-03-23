+++
title = "Aprende a utilizar el paquete \"embed\" de Go y crea una página web fácilmente"
date = "2021-08-16"
author = "charly3pins"
description = "¿Para qué sirve el nuevo paquete \"embed\" añadido en Go 1.16 y cómo usarlo para nuestro beneficio?"

tags = ["go"]

image = "/images/gopher-hiking.svg"
+++
Trabajar con ficheros estáticos nunca es tarea sencilla y menos en Go ya que no teníamos soporte nativo para ellos y teníamos que tirar de librerías de terceros. Con la release de [Go 1.16](https://blog.golang.org/go1.16) esto cambió. Y cambió para bien, ya que incluye un nuevo paquete llamado [embed](https://pkg.go.dev/embed) que de forma nativa nos ayuda a trabajar con los ficheros estáticos.

En la documentación oficial del paquete (link anterior) aparecen varios ejemplos de uso de dicha librería:
- incrustando un fichero como `string`
- incrustando un fichero como `[]byte`
- incrustando un fichero como el tipo propio de la librería `embed.FS`

Los dos primeros casos son muy simples y con los ejemplos de dicho artículo se entienden perfectamente. Por dar un poco más de ejemplos (sin código) os puedo decir que el caso de `string` podría ser válido cuando queremos cargar algún valor de configuración "simple" a partir de un fichero externo. En vez de tirar de una variable de entorno, podríamos tener un fichero de config con ese valor (no sensibles por supuesto) y cargar dicho fichero con la librería para incrustar ese valor.

Si quisiéramos hacer lo mismo pero con más de un valor (más de un `string`) tendríamos que usar el otro tipo, `[]byte`. De esta forma podríamos tener por ejemplo un `.yaml` (adoramos YAML ¿no?) con nuestra configuración para la aplicación e incrustarlo en nuestra aplicación como array de bytes y cargar todos los valores de golpe. Luego con hacer un custom type (un struct mismo) y hacerle unmarshall del `[]byte` a nuestro type nos serviría sin problemas.

El tercer tipo de dato para mí es el más interesante de comentar y por eso escribo este post. Si alguna vez has montado una página web, sabrás que se compone de varios ficheros... ¡ajá! estáticos. Para ello en Go tenemos el paquete `html/template` el cual necesita cargar en memoria las plantillas de las páginas que queremos montar.

Llegados a este punto te podrías preguntar, ¿por qué es tedioso trabajar con estáticos? o también ¿en qué momento es todo esto útil? Pues ahora mismo lo voy a explicar. Imagina que nuestro programa necesita leer un fichero, en el ejemplo anterior la plantilla html. Esta plantilla tendrá una ubicación, un directorio en el cual está almacenada. Esta ubicación será válida mientras nuestro código se compile en el directorio actual. En el momento que hagamos un `go build` y el binario lo movamos a otro destino, esa lectura nos va a fallar porqué no va a encontrar la ruta especificada. Para resolver este problema existe el paquete `embed`.

Vamos a ver un poco de código para este caso. Primero de todo miramos la [documentación](https://pkg.go.dev/embed#FS) y vemos qué campos tiene el tipo que nos interesa `embed.FS` y qué métodos nos ofrece. Vemos que no hay campos pero sí tres métodos para abrir un fichero, leer un fichero y leer un directorio y que éstos devuelven un `fs.File`, un `[]byte` y un `[]fs.DirEntry` respectivamente además del clásico error cada uno.

Ya que queremos montar una web, vamos a ver el paquete anteriormente comentado qué métodos nos ofrece que estén relacionados con los tres tipos que podemos obtener del paquete `embed.FS`. Vemos que hay un método [ParseFS()](https://pkg.go.dev/html/template#ParseFS) que parece el adecuado ya que recibe un `fs.FS` y un `string...` con los directorios de donde vamos a cargar dicho fichero.

Teniendo en cuenta que las plantillas las podemos tener simples o tirando de layouts, vamos a ver el caso más completo que es cuando usamos un layout para definir la pantalla que queremos pintar y ejecutar dicho layout en nuestras plantillas.

## Ejemplo construyendo una página web

Para hacer este ejemplo crearemos la siguiente estructure de carpetas y ficheros:
```vim
|- templates/
|- templates/
	|- layouts/
|- main.go
```

Nuestra main layout podría ser algo parecido al siguiente bloque como `layout.html`:
```go
{{define "main"}}
<html lang="en">
	<head>
		<title>Testing embed</title>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
	</head>

	<body>
		<div class="container-fluid">
			{{template "content" .}}
		</div>
	</body>
</html>
{{end}}
```
Obviamente esto se puede complicar tanto como desees y necesites. Para el ejemplo que quiero mostrar no hace falta complicarlo más.

La template podría ser la siguiente como `userProfile.html`:
```go
{{template "main" .}}
{{define "content"}}
<div class="container">
  <div class="dashboard jumbotron-fluid">
    <h1>User</h1>

    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{.Name }}</h5>
            <p class="card-text">Email: {{.Email }}</p>
            <p class="card-text">Address: {{.Address }}</p>
            <p class="card-text">Phone number: {{.PhoneNumber }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{{end}}
```
Como veis es algo muy simple también para mostrar información de un usuario muy básico. Podría ser la página del perfil de un usuario.

Una vez tenemos tanto el layout como la template, tenemos que picar nuestro código en Go para cargar dichas información. Para ello creamos la función a continuación en nuestro `main.go`.
```go
package main

import (
	"embed"
	"fmt"
	"html/template"
	"io"
	"io/fs"
)

const (
	layoutsDir   = "templates/layouts"
	templatesDir = "templates"
	extension    = "/*.html"
)

var (
	//go:embed templates/* templates/layouts/*
	files     embed.FS
	templates map[string]*template.Template
)

func LoadTemplates() error {
	if templates == nil {
		templates = make(map[string]*template.Template)
	}
	tmplFiles, err := fs.ReadDir(files, templatesDir)
	if err != nil {
		return err
	}

	for _, tmpl := range tmplFiles {
		if tmpl.IsDir() {
			continue
		}

		pt, err := template.ParseFS(files, templatesDir+"/"+tmpl.Name(), layoutsDir+extension)
		if err != nil {
			return err
		}

		templates[tmpl.Name()] = pt
	}
	return nil
}
```
Lo interesante aquí es ver como definimos la parte de las variables:
```go
//go:embed templates/* templates/layouts/*
files     embed.FS
```
Con esto le indicamos al compilador que busque dentro de templates y de templates/layouts los archivos y los cargue en la variable `files`. Luego en nuestra función de cargar plantillas simplemente inicializamos un mapa donde guardamos el nombre de la plantilla y el valor de ésta. Tal como comenté antes, usamos el paquete `fs` para leer los ficheros cargados con el paquete `embed` y luego ya los podemos ejecutar con la función que vimos de `ParseFS`. 

Ahora que ya tenemos nuestras plantillas cargadas es hora de exponerlas. Para ello levantaremos un server HTTP sencillito para que se vea como acceder a nuestras plantillas. Primero de todo creamos nuestro handler. El siguiente bloque puede estar en el mismo `main.go` o en un fichero diferente. Dependiendo del caso las llamadas a la función para renderizar las templates y a algunas variables deberán modificarse.
```go
const userProfile = "userProfile.html"
func UserProfile(w http.ResponseWriter, r *http.Request) {
	t, ok := templates[userProfile]
	if !ok {
		log.Printf("template %s not found", userProfile)
		return
	}

	data := make(map[string]interface{})
	data["Name"] = "John Doe"
	data["Email"] = "johndoe@email.com"
	data["Address"] = "Fake Street, 123"
	data["PhoneNumber"] = "654123987"

	if err := t.Execute(w, data); err != nil {
		log.Println(err)
	}
}
```

Finalmente añadimos nuestra función `main()` en el fichero `main.go`:
```go
func main() {
	err := LoadTemplates()
	if err != nil {
		log.Fatal(err)
	}
	r := http.NewServeMux()
	r.HandleFunc("/user-profile", UserProfile)

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Println(err)
	}
}
```

## Conclusión

Con todo esto espero que trabajar con los ficheros estáticos te resulte mucho más sencillo y práctico que antes. Puede ver el código completo en [mi repositorio](https://github.com/charly3pins/go-embed-example).
Si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que lo hiciera, déjame un comentario aquí mismo o por mis redes sociales que tienes en mi perfil y estaré encantado de responder.
