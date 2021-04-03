+++
title = "Missatges de commit personalitzats de Git"
date = "2020-03-10"
author = "charly3pins"
description = "Genera missatges de commit personalitzats per al vostre repositori i estandarditzeu el registre de commits."

slug = "Missatges de commit personalitzats de Git"
tags = ["git", "terminal"]

image = "/images/git-commit.png"
+++
He estat utilitzant l'eina [CMF](https://github.com/walmartdigital/commit-message-formatter) durant l'últim any i crec que la seva simplicitat és el seu potencial. Bàsicament és una eina terminal desenvolupada a Go by [Walmart Digital](https://github.com/walmartdigital) que us ajuda a normalitzar el registre de compromisos dels vostres projectes.

He estat utilitzant durant l'últim any i mig aproximadament i tot el que puc dir és molt útil. Vam acordar amb l'equip la configuració que volem utilitzar i vam definir un conjunt de canvis que s'apliquen en el nostre cas. També escollim el [Jira flow](https://github.com/walmartdigital/commit-message-formatter#jira-flow) i varem canviar els valors del "canvi" afegint un emojis per fer que els compromisos siguin una mica més divertits per comprovar-los al registre.

Podeu instal·lar-lo mitjançant npm:
```vim
npm install -g go-cmf
``` 
o des de Go:
```vim
go install github.com/walmartdigital/commit-message-formatter
```

Després, obriu un terminal i aneu a l'arrel del projecte que vulgueu utilitzar. A continuació, escriviu:
```vim
cmf init 
```

Haureu de seleccionar un dels fluxos i crearà un fitxer `.cmf.yaml` amb la plantilla del seleccionat. Podeu editar aquest fitxer de la manera que vulgueu. La condició única és que qualsevol variable que vulgueu utilitzar s'hagi de definir mitjançant `{{}}`. Exemple: "{{CHANGE}}" us demanarà que demaneu el "CANVI" que heu fet i que mostreu les opcions que heu definit a la plantilla.

Aquí teniu el fitxer `.cmf.yaml` que estic fent servir en aquest lloc:
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