+++
title = "He generado mi CV usando Go templates"
date = "2023-09-23"
author = "charly3pins"
description = "Cómo utilizar las plantillas Go para generar páginas HTML y aprovecharlas al máximo."

tags = ["go"]

image = "/images/gopher-welder.svg"
+++
## Introduction
If you need to present any kind of data in a structured and formatted way you could find this article interesting. Go provides a way to do this in an easy and effective manner with two packages, `text/template` and `html/template`. The first one is focused on formatting texts in general and I am using it to generate my README page in GitHub. You can find the details in [https://github.com/charly3pins/charly3pins](https://github.com/charly3pins/charly3pins). In this article, I am going to cover the second one, the templating for HTML pages. It's true that at the end I will generate a PDF from it but let's go step by step!
I recommend you read the [documentation page](https://pkg.go.dev/html/template) since I'm not going to cover the whys and whats about the package, only showing you how I organized the templates and how I generate my Resume using it.

## CV Template
First of all I created a YAML file where I will store all my CV information called `me.yaml`. The structure that I decided on was the following one:
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
(I removed all the data to make it readable but you can get an idea of what is inside each key).

After that, I started creating the base template for the HTML page that I wanted to generate. I stored it inside `tmpl/base.html`
```html
{{ define "base" }}
<!doctype html>
<html lang='en-US'>
<head>
    <title>{{.Name}} | {{.Role}}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <main>
  </main>
</body>
</html>
{{ end }}
```
This is the base only, so there is no data displayed yet, only the Name and the Role. 

For maintainability reasons, I split each section of my CV into a partial template. All partial templates I stored inside `tmpl/partials/`. So for example, I created the `about.html` that is as simple as:
```html
<div id=about>
  <h1 id=name style='grid-area: name'>{{.Name}}</h1>
  <div id=role style='grid-area: role'>{{.Role}}</div>
  <div id=contact style='grid-area: contact'><a href="mailto:{{.Email}}">{{.Email}}</a> • <a href="{{.Web}}">{{.Web}}</a></div>
</div>
```

And other(s) with more logic like the `experience.html`:

```html
<div id=experience>
<h2>Experience</h2>
{{ range .Experience }}
<div class=employer>
  <div class=role>
    <div><strong>{{.Role}}</strong></div>
    <div class=dates>{{.Started}} - {{if .Stopped}}{{.Stopped}}{{else}}Present{{end}}</div>
  </div>
  <div class=entity>{{.Entity}} <span class=loc>({{.Location}})</span></div>
</div>

<ul class=deets>
{{ range .Details }}
  <li class=deet>{{- . -}}</li>
{{end}}
</ul>

</div>
{{end}}
```

After creating all the needed ones, I added them inside the base one created before using the `{{template}}` action to invoke the partials in the place that I desired. The resulting `base.html` looks like:
```html
{{ define "base" }}
<!doctype html>
<html lang='en-US'>
<head>
    <title>{{.Name}} | {{.Role}}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <main>
    {{ template "about.html" . }}
    {{ template "mission.html" . }}
    <br>
    {{ template "skills.html" . }}
    <br>
    {{ template "experience.html" . }}
    <br>
    {{ template "projects.html" . }}
    <br>
    {{ template "education.html" . }}
    <br>
    {{ template "keywords.html" . }}
    <br>
    {{ template "languages.html" . }}
  </main>
</body>
</html>
{{ end }}
```

I have chosen this order but you can order the partials however you want and repeat them as many times as you want, there is no limitation in that regard.

## Generating the HTML page

Cool! At this point, we have our "Database" in our YAML file, and we have our base template invoking our partial templates, so the only point we are missing is to combine the data with the templates and generate our HTML page to have our CV published.

I created a `main.go` in the root of the project and I added the following code:
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

I used the `gopkg.in/yaml.v3` library to work with YAML easily but you can find probably others that serve your purpose but I'm used to working with this one.

Then I declared the constants for the YAML and HTML filenames.

After that inside the `main()` I have that slice of strings where I indicate all my templates and its path. I think this can be simplified in the future using another function from the package but for now, I wanted to have it as simple as possible.

The next step is to parse the files I want to use as templates. The package provides the function `func (t *Template) ParseFiles(filenames ...string) (*Template, error)`, so I just passed my slice to it and then all the templates are ready to be used at any point.

The other piece that I needed was to parse the YAML file and for that, I simply read the file where I have all the information and then used the lib mentioned before unmarshaling it to a `map[string]interface{}{}`. 

Having the templates parsed and the information loaded, the third file that comes to the table game is the final HTML. I just used the function `func Create(name string) (*File, error)` to create that.

Lastly, I glued all the parts with the executino of the template with the following function `func (t *Template) ExecuteTemplate(wr io.Writer, name string, data any) error`

* The first argument is an `io.Writter` so our HTML file.
* The second one is the name of the template that we want to execute. In our case we only defined one template (even though we created multiple partials, we only defined the `base` one with the command `{{ define "base" }}`).
* The last one is the data we want to pass (if any) to our template, so our loaded YAML file.

To generate the `resume.html` file, I run from the root directory:
```go
go run main.go
```


## Conclusion

I hope that this easy and simple example has helped you learn or expand your knowledge in the use of templates in Go and that it has given you ideas on how to generate your pages in HTML or in text to format your texts in an organized and structured way without having to worry about anything beyond generating the template and the data structure to satisfy said template.

You can find the complete source code in [https://github.com/charly3pins/cv](https://github.com/charly3pins/cv) where I added some CSS and more fancy stuff to improve virtually the Resume and where I will be adding updates in the future.

I hope everything that I have tried to explain in this post has been clear, and please if there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
