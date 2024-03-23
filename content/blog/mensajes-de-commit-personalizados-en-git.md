+++
title = "Mensajes de commit personalizados en Git"
date = "2020-03-10"
author = "charly3pins"
description = "Genera mensajes de commit personalizados para tus repositorios y estandariza tu registro de commits."

tags = ["git", "terminal"]

image = "/images/git-commit.png"
+++
He estado usando la herramienta [CMF](https://github.com/walmartdigital/commit-message-formatter) durante el último año y creo que su simplicidad es su potencial. Básicamente es una herramienta de terminal desarrollada en Go por [Walmart Digital](https://github.com/walmartdigital) que te ayuda a estandarizar el log de commits de tus proyectos.

Lo he estado usando durante el último año y medio aproximadamente y todo lo que puedo decir es muy útil. Acordamos con el equipo la configuración que queremos utilizar y definimos un conjunto de cambios que aplica en nuestro caso. También elegimos el [Jira flow](https://github.com/walmartdigital/commit-message-formatter#jira-flow) y cambiamos los valores para el `cambio` agregando un emojis para hacer las confirmaciones un poco más divertidas para comprobarlos en el registro.

Puede instalarlo a través de npm:
```vim
npm install -g go-cmf
``` 
o desde Go:
```vim
go install github.com/walmartdigital/commit-message-formatter
```

Después de eso, abra una terminal y navegue hasta la raíz del proyecto que desea usar. Luego escriba:
```vim
cmf init 
```

Deberá seleccionar uno de los flujos y creará un archivo `.cmf.yaml` con la plantilla del seleccionado. Puede editar ese archivo de la forma que desee. La condición única es que cualquier variable que desee utilizar debe definirse mediante `{{}}`. Ejemplo: `{{CHANGE}}` le preguntará el "CAMBIO" que hizo y mostrará las opciones que definió en la plantilla.

Aquí está el archivo `.cmf.yaml` que estoy usando en este sitio:
```
PROMPT:
    - KEY: "CHANGE"
      LABEL: "Type of change"
      OPTIONS:
        - VALUE: "feat :sparkles:"
          DESC: "A new feature"
        - VALUE: "fix :bug:"
          DESC: "A bug fix"
        - VALUE: "test :rotating_light:"
          DESC: "Adding missing tests or correcting wrong ones"
        - VALUE: "style :lipstick:"
          DESC: "A code change to improve clean code"
        - VALUE: "build-ci :construction_worker_man:"
          DESC: "Changes that affect the build system and/or CI configuration files and scripts"
        - VALUE: "refactor :hammer:"
          DESC: "A code change"
        - VALUE: "docs :books:"
          DESC: "Documentation only changes"
        - VALUE: "chore :card_index:"
          DESC: "Changes that don't fit any of the options above"
    - KEY: "MESSAGE"
      LABEL: "Commit message"
TEMPLATE: "{{CHANGE}}: {{MESSAGE}}"
```