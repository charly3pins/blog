+++
title = "Automatitzi el README pel seu perfil de GitHub amb Go i GitHub Actions"
date = "2021-03-16"
author = "charly3pins"
description = "Crear amb l'ajuda de Go un fitxer Markdown dinàmic pel README i desplegar-lo al GitHub del seu perfil fent servir GitHub Actions."

slug = "Automatitzi el README pel seu perfil de GitHub amb Go i GitHub Actions"
tags = ["go", "github", "ci/cd"]

image = "/images/github-profile-readme/charly3pins-profile.png"
+++
Després del post on vaig explicar [com crear un README pel perfil de GitHub]({{< relref path="/blog/build-an-awesome-github-profile-readme.md" lang="ca">}}), em va faltar incloure dins la secció del `Bloc` un link a l'últim post publicat. Principalment no ho vaig fer perquè no volia tenir que actualitzar a ma cada vegada el README amb l'últim post i el seu link. Per resoldre això vaig estar pensant com podia automatitzar aquesta actualització. Mentres feia la meva lectura diaria dels RSS que segueixo amb l'aplicació Feedly, vaig caure en que jo també tenia feed RSS. Per tant, podia llegir jo mateix el feed del meu bloc i obtenir l'últim post d'allà de forma senzilla.

Un cop coberta la part de com obtenir l'últim post publicat, em faltava la part de com actualitzar el README i és on vaig probar per primera vegada (ja feia temps que tenia ganes) les [GitHub Actions](https://github.com/features/actions). Fa un temps que GitHub va treure al mercat aquestes accions que bàsicament serveixen per crear workflows automàtics per [CI/CD](https://en.wikipedia.org/wiki/CI/CD).

Amb les dues parts del problema cobertes, només em faltava una petita cosa... fer-ho! Així que explicaré en detall com vaig fer ambdues coses per a que ho pugui fer servir en el seu projecte si li interessa.

## Obtenir l'últim post amb Go

Necessitava escanejar el feed del blog i ho volia fer en Go, per tant, el primer que vaig fer va ser buscar si ja hi havia alguna llibreria que em facilités aquesta tasca per no reinventar la roda i vaig trobar la [github.com/mmcdole/gofeed](https://github.com/mmcdole/gofeed). Tenía un munt de funcionalitats però jo amb l'ús basic descrit al seu README en tenia suficient.

Amb el següent tros de codi, creo un nou parser, escanejo la direcció del meu feed i dels elements resultants, em quedo amb el primer, ja que és l'últim post publicat.
```go
p := gofeed.NewParser()
feed, err := p.ParseURL("https://charly3pins.dev/index.xml")
if err != nil {
    log.Fatalf("error getting feed: %v", err)
}
newestItem := feed.Items[0]
```

Amb això  ja tinc l'item amb tota la informació. El seu aspecte és similar a:
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

El que m'interessa per mostrar al README és només el `title` i el `link`.

## Llegir i escriure el README

Un cop tenia la informació necessaria ara tocava llegir el fitxer `README.md` del [repositori](https://github.com/charly3pins/charly3pins), escriure els canvis i guardar-lo de nou.

Per fer-ho podia llegir el fitxer fent servir la llibreria standard `ioutil.ReadFile()`, però en aquest cas com que no vull reaprofitar res del fitxer, puc cridar directament al `os.Create()` per crear un nou fitxer i així sobreescriure el README.md que ja tenia al directori.

A més, com que vull posar la informació del feed juntament amb la part estàtica de text que ja tenia, el que faré es crear varies cadenes de text amb les diferents seccions que vull posar al perfil i després ajuntar-les totes amb un `fmt.Sprintf()`.

El codi que fa tot això és el següent:
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

El que falta per veure d'aquí és el valor de `filename` i el de `data`. El primer és fàcil, simplement la ruta per arribar al README. En el meu cas com tinc el projecte en un subdirectori del meu repositori he de fer servir `filename = ../README.md`. A l'altra variable, el que hi ha és el següent:
```go
hi := "# Hey there!"
blog := "## Blog\n\nMy latest blog post is: **[" + newestItem.Title + "](" + newestItem.Link + ")**."

data := fmt.Sprintf("%s\n\n%s\n\n%s\n\n%s\n", hi, blog)
```

La part important és la de `blog` on es veu clarament com llegeixo la informació del feed.

Pot veure el codi complert al [meu repositori](https://github.com/charly3pins/charly3pins/blob/main/update/main.go). 

## Executant automàticament el procés

Un cop ja tenim el codi que ens genera el README automàtic i de forma dinàmica segons l'últim post, el que queda per fer es que s'executi de forma periòdica i no ens tinguem que preocupar de res. Per a fer-ho faré servir un [trigger](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) de GitHub Actions per a que cada cop que faci un push a la branca `master` executi el procés i també que s'executi de forma planificada cada diumenge a les 12am.

Primer de tot necessito la carpeta `.github/worfklows` i a dins hi creo el fitxer `update.yaml` amb el contingut següent:
```vim
on:
  push:
    branches:
      - master
  schedule:
    - cron: '0 0 * * 0'
```

Quan ja està el trigger llest, el que s'han de definir són els [jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs). Es poden definir tants com es vulguin, en el meu cas amb 3 senzills en tinc suficient. El primer farà un `checkout` del projecte, el segon `generarà` el README i el tercer `desplegarà` els canvis. Per a fer l'últim pas haurem de fer servir els mecanismes d'[autenticació](https://docs.github.com/en/actions/reference/authentication-in-a-workflow) que proporciona GitHub Actions. El codi resultants és:
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

Pot veure el codi complert al [meu repositori](https://github.com/charly3pins/charly3pins/blob/main/.github/workflows/update.yaml).

No dubti a comentar aquí o contactar-me en les meves xarxes socials per a qualsevol comentari, pregunta o suggeriment.
