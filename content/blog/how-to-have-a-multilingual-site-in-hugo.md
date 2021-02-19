+++
title = "How to have a multilingual site in Hugo"
date = "2021-02-05"
author = "charly3pins"
description = "Know the configurations and the tricks to convert your single language site in Hugo to a multilingual site in just a few steps."

tags = ["hugo", "cms"]
category = "technology"

image = "/images/gohugoio-card.png"
banner = "/images/gohugoio-card-banner.png"
thumb = "/images/gohugoio-card-thumb.png"
+++

As you can see since this week this humble website has been remodeled a bit both visually and internally, and it is that not only there are new colors, images and sections, but it also offers all its content in 2 new languages! I have decided to do this step because first of all I wanted to test how the multilingual thing worked in Hugo and also to try to make reading the articles more comfortable for people who visit it, without the language being an obstacle and offering the greatest comfort and pleasure to readers.

The languages ​​as you can see in the navbar are Spanish and Catalan. So to change the language in which you are viewing the page, it is as simple as choosing in the dropdown selector which language you prefer and everything will automatically be translated. If you find any misprints in the translation or any part that is not translated, please put a comment on the post in question or comment on my social networks (links at the bottom of the web).

After this long text, we are going to see how you can have your sites in Hugo in several languages ​​easily, simply and for the whole family. Let's go there!

## Set Languages

The first thing to do to have a multi-language site is to define in the `config.toml` the languages ​​that you want to offer. In my case I have decided English, Spanish and Catalan in the following way:
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
The `languageName` it is used to define the text that will be seen on the web when checking which languages ​​are available. Spoiler alert! Later we will see how to translate these texts as well.

## Menus

To translate the menus in the different languages, they must be declared as follows:
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

## Content

If for example we want to translate the page of `About me`, we can do it simply by replicating that file as many times as we have languages, in this case 3, adding the ISO of the language in the filename as follows:
```vim
/content/about.en.md
/content/about.es.md
/content/about.ca.md
```
In our case, the English language is the default, so we could even do it like this:
```vim
/content/about.md
/content/about.es.md
/content/about.ca.md
```

## Translated content

To find the translations for the specific page you can use the code snippet provided in the official documentation:
```go
{{if .IsTranslated}}
<h4> {{i18n "translations"}} </h4>
<ul>
    {{range .Translations}}
    <li>
        <a href="[{ .Permalink }-lex.europa.eu"> {{.Lang}}: {{.Title}} {{if .IsPage}} ({{i18n "wordCount".}}) {{end}} < / a>
    </li>
    {{end}}
</ul>
{{end}}
```

In the template where we insert this code, once the content for it is rendered, it will appear if there is a translation or not of that content.

## Translation of texts

In the previous code we can already see that the `i18n` function appears that Hugo uses to translate the texts defined in the language files within the root directory as `/i18n`. The format of the files inside must be for example:
```vim
i18n/en.toml
i18n/es.toml
i18n/ca.toml
```
For each language described above respectively.

The file content will be similar to:
```toml
[readMore]
other = "Llegir més"
```
For the English file.
```toml
[readMore]
other = "Llegir més"
```
For the Spanish file.
```toml
[readMore]
other = "Llegir més"
```
For the Catalan file.

Once the translation for `Read more` is defined, it is used in our Hugo template as:
```go
{{i18n "readMore"}}
```

And the result will be the text defined in the `.toml` according to the language chosen by the user to view the web page.

## Singular and/or plural translation

Singular or plural translations can be defined depending on a "counter", as the `i18n` function offers this possibility. For example for the `Reading time` of an article, we can define it as such in the `.toml`:
toml
[readingTime]
one = "One minute to read"
other = "{{.Count}} minutes to read"
```

We see that we pass the `.Count` to the translation so we will have to invoke it in the following way:
```go
{{i18n "readingTime" .ReadingTime}}
```
> Note: the `.ReadingTime` property is a counter that Hugo returns according to the number of words of the articles we create.

## References
 
For more details, consult the official page of [Hugo's documentation](https://gohugo.io/content-management/multilingual/).