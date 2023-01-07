+++
title = "Aprèn a fer servir el paquet embed a Go construint una pàgina web fàcilment"
date = "2021-08-16"
Autor = "charly3pins"
description = "Per a què serveix el nou paquet embed afegit a Go 1.16 i com fer-lo servir per al nostre benefici?"

slug = "Aprèn a fer servir el paquet embed a Go construint una pàgina web fàcilment"
tags = ["go"]

image = "/images/gopher-hiking.svg"
caption = "https://github.com/egonelbre/gophers/blob/master/vector/adventure/hiking.svg"
captionAuthor = "Egon Elbre"
+++
Treballar amb fitxers estàtics mai és una tasca senzilla i menys en Go ja que no teníem suport natiu per a ells i havíem de tirar de llibreries de tercers. Amb la release de [Go 1.16](https://blog.golang.org/go1.16) això va canviar. I va canviar per a bé, ja que inclou un nou paquet anomenat [embed](https://pkg.go.dev/embed) que de forma nativa ens ajuda a treballar amb els fitxers estàtics.

En la documentació oficial del paquet (link anterior) apareixen diversos exemples d'ús d'aquesta llibreria:
- incrustant un fitxer com `string`
- incrustant un fitxer com `[]byte`
- incrustant un fitxer com el tipus propi de la llibreria `embed.FS`

Els dos primers casos són molt simples i amb els exemples d'aquest article s'entenen perfectament. Per donar una mica més d'exemples (sense codi) us puc dir que el cas de `string` podria ser vàlid quan volem carregar algun valor de configuració "simple" a partir d'un fitxer extern. En comptes de tirar d'una variable d'entorn, podríem tenir un fitxer de config amb aquest valor (no sensibles és clar) i carregar aquest fitxer amb la llibreria per a incrustar aquest valor.

Si volguéssim fer el mateix però amb més d'un valor (més d'un `string`) hauríem de fer servir l'altre tipus, `[]byte`. D'aquesta manera podríem tenir per exemple un `.yaml` (adorem YAML no?) Amb la nostra configuració per a l'aplicació i incrustar-lo en la nostra aplicació com array de bytes i carregar tots els valors de cop. Després amb fer un custom type (1 struct mateix) i fer-li unmarshall del  `[]byte` al nostre type ens serviria sense problemes.

El tercer tipus de dada per a mi és el més interessant de comentar i per això escric aquest post. Si alguna vegada has muntat una pàgina web, sabràs que es compon de diversos fitxers... això mateix! estàtics. Per això en Go tenim el paquet `html/template` el qual necessita carregar en memòria les plantilles de les pàgines que volem muntar.

Arribats a aquest punt et podries preguntar, per què és tediós treballar amb estàtics? o també en quin moment és tot això útil? Doncs ara mateix ho vaig a explicar. Imagina que el nostre programa necessita llegir un fitxer, en l'exemple anterior la plantilla html. Aquesta plantilla tindrà una ubicació, un directori en el qual està emmagatzemada. Aquesta ubicació serà vàlida mentre el nostre codi es compili en el directori actual. En el moment que fem un `go build` i el binari ho moguem a un altre destí, aquesta lectura ens fallarà perquè no va a trobar la ruta especificada. Per resoldre aquest problema existeix el paquet `embed`.

Anem a veure una mica de codi per a aquest cas. Primer de tot mirem la [documentació](https://pkg.go.dev/embed#FS) i veiem quins camps té el tipus que ens interessa `embed.FS` i quins mètodes ens ofereix. Veiem que no hi ha camps però sí tres mètodes per obrir un fitxer, llegir un fitxer i llegir un directori i que aquests tornen un `fs.File`, un `[]byte` i un `[]fs.DirEntry` respectivament a més del clàssic error cada un.

Ja que volem muntar una web, anem a veure el paquet anteriorment comentat quins mètodes ens ofereix que estiguin relacionats amb els tres tipus que podem obtenir del paquet `embed.FS`. Veiem que hi ha un mètode [ParseFS()](https://pkg.go.dev/html/template#ParseFS) que sembla l'adequat ja que rep un `fs.FS` i un `string...` amb els directoris d'on anem a carregar aquest fitxer.

Tenint en compte que les plantilles les podem tenir simples o tirant de layouts, veurem el cas més complet que és quan fem servir un layout per definir la pantalla que volem pintar i executar dit layout a les nostres plantilles.

## Exemple construint una pàgina web

Per fer aquest exemple crearem la següent estructuri de carpetes i fitxers:
```vim
|- templates/
|- templates/
	|- layouts/
|- main.go
```

La nostra main layout podria ser una cosa semblant a el següent bloc com `layout.html`:
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
Òbviament això es pot complicar tant com vulguis i necessitis. Per l'exemple que vull mostrar no cal complicar-ho més.

La template podria ser la següent com `userProfile.html`:
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
Com veieu és una cosa molt simple també per a informació d un usuari molt bàsic. Podria ser la pàgina del perfil d'una persona.

Un cop tenim tant el layout com la template, hem de picar el nostre codi a Go per carregar aquestes informació. Per a això vam crear la funció a continuació en el nostre `main.go`.
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
L'interessant aquí és veure com definim la part de les variables:
```go
//go:embed templates/* templates/layouts/*
files     embed.FS
```
Amb això li indiquem a el compilador que busqui dins de templates i de templates / layouts els arxius i els carregui en la variable `files`. Després en la nostra funció de carregar plantilles simplement inicialitzem un mapa on guardem el nom de la plantilla i el valor d'aquesta. Tal com vaig comentar abans, fem servir el paquet `fs` per llegir els fitxers carregats amb el paquet `embed` i després ja els podem executar amb la funció que vam veure de `ParseFS`.

Ara que ja tenim les nostres plantilles carregades és hora d'exposar-les. Per a això aixecarem 1 server HTTP senzillet perquè es vegi com accedir a les nostres plantilles. Primer de tot vam crear el nostre handler. El següent bloc pot estar en el mateix `main.go` o en un fitxer diferent. Depenent de el cas les crides a la funció per a renderitzar les templates i a algunes variables hauran de modificar.
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

Finalment afegim la nostra funció `main()` en el fitxer `main.go`:
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

## Conclusió

Amb tot això espero que treballar amb els fitxers estàtics et resulti molt més senzill i pràctic que abans. Pot veure el codi complert al [meu repositori](https://github.com/charly3pins/go-embed-example).
Si hi ha alguna part que no ha quedat de el tot clara o hi ha parts que no he cobert que t'agradaria que ho fes, deixa un comentari aquí mateix o pels meus xarxes socials que tens al meu perfil i estaré encantat de respondre.
