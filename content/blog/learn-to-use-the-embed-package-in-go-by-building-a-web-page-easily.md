+++
draft = true
title = "Learn to use the embed package in Go by building a web page easily"
date = "2021-08-16"
author = "charly3pins"
description = "What is the new embed package added in Go 1.16 for and how can we use it to our advantage?"

tags = ["go"]

image = "/images/gopher-hiking.svg"
caption = "https://github.com/egonelbre/gophers/blob/master/vector/adventure/hiking.svg"
captionAuthor = "Egon Elbre"
+++
Working with static files is never an easy task and less so in Go since we did not have native support for them and we had to pull third-party libraries. With the release of [Go 1.16](https://blog.golang.org/go1.16) this changed. And it changed for the better, since it includes a new package called [embed](https://pkg.go.dev/embed) that natively helps us work with static files.

In the official documentation of the package (previous link) there are several examples of use of this library:
- embedding a file as `string`
- embedding a file as `[]byte`
- embedding a file as the proper type of the `embed.FS` library

The first two cases are very simple and with the examples in that article they are perfectly understood. By giving a little more examples (without code) I can tell you that the case of `string` could be valid when we want to load some" simple "configuration value from an external file. Instead of pulling an environment variable, we could have a config file with that value (not sensitive of course) and load that file with the library to embed that value.

If we wanted to do the same but with more than one value (more than one `string`) we would have to use the other type,` []byte`. In this way we could have for example a `.yaml` (we love YAML right?) With our configuration for the application and embed it in our application as an array of bytes and load all the values ​​at once. Then making a custom type (a struct itself) and marshalling the `[]byte` to our type would serve us without problems.

The third type of data for me is the most interesting to comment on and that is why I write this post. If you have ever set up a web page, you will know that it consists of several files... aha! static. For this, in Go we have the `html/template` package which needs to load the templates of the pages that we want to mount in memory.

At this point you might ask yourself, why is it tedious to work with statics? or also when is all this useful? Well right now I'm going to explain. Imagine that our program needs to read a file, in the previous example the html template. This template will have a location, a directory in which it is stored. This location will be valid as long as our code compiles into the current directory. The moment we do a `go build` and move the binary to another destination, that reading will fail us because it will not find the specified path. To solve this problem there is the `embed` package.

Let's see a bit of code for this case. First of all we look at the [documentation](https://pkg.go.dev/embed#FS) and see what fields the type that interests us `embed.FS` has and what methods it offers us. We see that there are no fields but there are three methods to open a file, read a file and read a directory and that these return an `fs.File`, a `[]byte` and a `[]fs.DirEntry` respectively in addition to the classic mistake each.

Since we want to set up a website, we are going to see the previously commented package which methods it offers us that are related to the three types that we can obtain from the `embed.FS` package. We see that there is a method [ParseFS()](https://pkg.go.dev/html/template#ParseFS) that seems appropriate since it receives an `fs.FS` and a `string...` with the directories from where we are going to load said file.

Taking into account that the templates can be simple or by pulling layouts, we are going to see the most complete case which is when we use a layout to define the screen we want to paint and execute said layout in our templates.

## Example building a web page

To do this example we will create the following folder and file structure:
```vim
|- templates/
|- templates/
	|- layouts/
|- main.go
```

Our main layout could be something like the following block like `layout.tmpl`:
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
Obviously this can be as complicated as you want and need. For the example I want to show, it is not necessary to complicate it further.

The template could be the following as `user_profile.tmpl`:
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
As you can see, it is also very simple to show information from a very basic user. It could be a user's profile page.

Once we have both the layout and the template, we have to chop our code in Go to load said information. To do this we create the function below in our `main.go`.
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
The interesting thing here is to see how we define the part of the variables:
```go
//go:embed templates/* templates/layouts/*
files     embed.FS
```
With this we tell the compiler to look inside templates and templates / layouts for the files and load them into the `files` variable. Then in our function to load templates we simply initialize a map where we save the name of the template and its value. As I mentioned before, we use the `fs` package to read the files loaded with the` embed` package and then we can execute them with the function we saw from `ParseFS`.

Now that we have our templates loaded it is time to expose them. For this we will build a simple HTTP server so that it can be seen how to access our templates. First of all we create our handler. The next block can be in the same `main.go` or in a different file. Depending on the case, the calls to the function to render the templates and to some variables must be modified.
```go
const userProfile = "userProfile.tmpl"
func UserProfile(w http.ResponseWriter, r *http.Request) {
	t, ok := templates[userProfile]
	if !ok {
		// TODO handle error
		return
	}

	data := make(map[string]interface{})		
	data["Name"] = "Jhon Doe"
	data["Email"] = "jhondoe@email.com"
	data["Address"] = "Fake Street, 123"
	data["PhoneNumber"] = "654123987"

	if err := t.Execute(w, data); err != nil {
		// TODO handle error
	}
}
```

Finally we add our `main()` function in the `main.go` file:
```go
func main() {
	r := http.NewServeMux()
	r.HandleFunc("/user-profile", UserProfile)

	if err := http.ListenAndServe(":8080", r); err != nil {
		// TODO handle error
	}
}
```

## Conclution

With all this, I hope that working with static files will be much easier and more practical than before. If there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
