+++
title = "Automatiza el README para tu perfil de GitHub con Go y GitHub Actions"
date = "2021-03-16"
author = "charly3pins"
description = "Crear con la ayuda de Go un fichero Markdown dinámico por README y desplegarlo en GitHub de su perfil con la ayuda de GitHub Actions."

tags = [ "go", "github", "ci/cd"]
image = "/images/github-profile-readme/charly3pins-profile.png"
+++
Tras el post donde expliqué [cómo crear un README para el perfil de GitHub]({{<relref path="/blog/crea-un-readme-increíble-para-tu-perfil-de-github.md">}}), me faltó incluir en la sección del `Blog` un link al último post publicado. Principalmente no lo hice porque no quería tener que actualizar a mano cada vez el README con el último post y su link. Para resolver esto estuve pensando cómo podía automatizar esta actualización. Mientras hacía mi lectura diaria de RSS que sigo con la aplicación Feedly, caí en que yo también tenía feed RSS. Por lo tanto, podía leer yo mismo el feed de mi blog y obtener el último post de allí de forma sencilla.

Una vez cubierta la parte de cómo obtener el último post publicado me faltaba la parte de cómo actualizar el README y es donde probé por primera vez (ya hacía tiempo que tenía ganas) las [GitHub Actions](https://github.com/features/actions). Hace un tiempo que GitHub sacó al mercado estas acciones que básicamente sirven para crear workflows automáticos para [CI/CD](https://es.wikipedia.org/wiki/CI/CD).

Con las dos partes del problema cubiertas, sólo me faltaba una pequeña cosa... ¡hacerlo! Así que explicaré en detalle como hice ambas cosas para que lo pueda utilizar en su proyecto si le interesa.

## Obtener el último post con Go

Necesitaba escanear el feed del blog y lo quería hacer en Go, por tanto, lo primero que hice fue buscar si ya había alguna librería que me facilitara esta tarea para no reinventar la rueda y encontré la [github.com/mmcdole/gofeed](https://github.com/mmcdole/gofeed). Tenía un montón de funcionalidades pero yo con el uso básico descrito en su README tenía suficiente.

Con el siguiente trozo de código, creo un nuevo parser, escaneo la dirección de mi feed y los elementos resultantes, me quedo con el primero, ya que es el último post publicado.
```go
p := gofeed.NewParser()
feed, err := p.ParseURL("https://charly3pins.dev/index.xml")
if err != nil {
    log.Fatalf("error getting feed: %v", err)
}
newestItem := feed.Items[0]
```

Con esto ya tengo el item con toda la información. Su aspecto es similar a:
```xml
<item>
    <title>My productivity setup for VS Code</title>
    <link>http://charly3pins.dev/blog/my-productivity-setup-for-vs-code/</link>
    <pubDate>Tue, 09 Mar 2021</pubDate>
    <guid>http://charly3pins.dev/blog/my-productivity-setup-for-vs-code/</guid>
    <description>I am gonna show you my setup for VS Code editor which makes me more productive and I feel more comfortable with the tool that I spend most of my time during the day.</description>
    <content><p>I spend a lot of hours during the day coding for the company I work for and during nights or weekends for myself, so I want to be comfortable with the tools I use constantly. One of them is my editor of code, specifically <a href="https://code.visualstudio.com/">VS Code</a>.....</content>
</item>
```

Lo que me interesa para mostrar al README es sólo el `title` y el `link`.

## Leer y escribir el README

Una vez tenía la información necesaria ahora tocaba leer el fichero `README.md` del [repositorio](https://github.com/charly3pins/charly3pins), escribir los cambios y guardarlo de nuevo.

Para ello podía leer el archivo usando la librería standard `ioutil.ReadFile()`, pero en este caso como no quiero reaprovechar nada del archivo, puedo llamar directamente al `os.Create()` para crear un nuevo archivo y así sobrescribir el README.md que ya tenía en el directorio.

Además, como que quiero poner la información del feed junto con la parte estática de texto que ya tenía, lo que haré es crear varias cadenas de texto con las diferentes secciones que quiero poner en el perfil y luego juntarlas todas con un `fmt.Sprintf() `.

El código que hace todo esto es el siguiente:
```go
file, err := os.Create(filename)
if err != nil {
	log.Println("error creating file", err)
	return
}
defer file.Close()

_, err = io.WriteString(file, data)
if err != nil {
	log.Println("error writing content to file", err)
	return
}
file.Sync()
```

Lo que falta por ver aquí es el valor de `filename` y el de `data`. El primero es fácil, simplemente la ruta para llegar al README. En mi caso como tengo el proyecto en un subdirectorio de mi repositorio tengo que usar `filename = ../README.md`. En la otra variable, lo que hay es el siguiente:
```go
hi := "# Hey there!"
blog := "## Blog\n\nMy latest blog post is: **[" + newestItem.Title + "](" + newestItem.Link + ")**."

data := fmt.Sprintf("%s\n\n%s\n\n%s\n\n%s\n", hi, blog)
```

La parte importante es la de `blog` donde se ve claramente como leo la información del feed.

Puede ver el código completo en [mi recompositorio](https://github.com/charly3pins/charly3pins/blob/main/update/main.go).

## Ejecutando automáticamente el proceso

Una vez ya tenemos el código que nos genera el README automático y de forma dinámica según el último post, lo que queda por hacer es que se ejecute de forma periódica y no nos tengamos que preocupar de nada. Para hacerlo usaré un [trigger](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) de GitHub Actions para que cada vez que haga un push a la rama `master` ejecute el proceso y también que se ejecute de forma planificada cada domingo a las 12am.

Primero de todo necesito la carpeta `.github/worfklows` y dentro creo el archivo` update.yaml` con el contenido siguiente:
```vim
on:
  push:
    branches:
      - master
  schedule:
    - cron: '0 0 * * 0'
```

Cuando ya está el trigger listo, lo que se tienen que definir son los [jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs). Se pueden definir tantos como se quieran, en mi caso con 3 sencillos tengo suficiente. El primero hará un `checkout` del proyecto, el segundo `generarà` el README y el tercero `desplegarà` los cambios. Para hacer el último paso tendremos que usar los mecanismos de [autenticación](https://docs.github.com/en/actions/reference/authentication-in-a-workflow) que proporciona GitHub Actions. El código resultantes es:
```vim
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: checkout repo
        uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: generate README
        run: |
          cd ${GITHUB_WORKSPACE}/update/
          go run main.go
      - name: deploy changes
        run: |
          git config user.name "${GITHUB_ACTOR}"
          git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
          git add .
          git commit -am ":rocket:: updated content"
          git push --all -f https://${{ secrets.GITHUB_TOKEN }}@github.com/${GITHUB_REPOSITORY}.git
```

Puede ver el código completo en [mi repositorio](https://github.com/charly3pins/charly3pins/blob/main/.github/workflows/update.yaml).

No dude en comentar aquí o contactarme en mis redes sociales para cualquier comentario, pregunta o sugerencia.
