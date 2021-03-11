+++
title = "La meva configuració per a una alta productivitat per al VS Code"
date = "2021-03-09"
author = "charly3pins"
description = "Et mostraré la meva configuració per a l'editor VS Code que em fa ser més productiu i sentir-me més còmode amb l'eina que passo la major part del meu temps durant el dia."

slug = "La meva configuració per a una alta productivitat per al VS Code"
tags = ["productivity", "vscode"]

image = "https://miro.medium.com/max/6000/0*8KANi15q2thT-dYt"
+++
Passo moltes hores durant el dia programant per a l'empresa en la qual treballo i durant les nits o els caps de setmana per a mi, així que vull estar còmode amb les eines que utilitzo constantment. Una d'elles és el meu editor de codi, específicament [VS Code](https://code.visualstudio.com/). Vaig començar amb Java i la més estesa per a ell és l'Eclipse amb totes les seves variants. Després em vaig canviar a Go i vaig ser un usuari de Sublime a tope durant varis anys fins que li vaig donar una oportunitat a VS Code. Oh sí! Des que ho vaig provar, mai vaig voler tornar enrere. Super ràpid, súper configurable, moltes extensions i MOLTS TEMES.

Llavors, després d'una llarga recerca investigant i ajustant (una història que mai acaba diria jo), vaig trobar una configuració que em fa sentir còmode, feliç i més productiu. Per això vull compartir amb vostè estimat lector, el meu tema, la meva font, els meus icones i les extensions que tinc per inspirar-lo a trobar la seva pròpia configuració ideal, a l'igual que jo ho vaig aconseguir.

El tema predeterminat que proporciona VS Code no és dolent en absolut, però li mostraré com passar d'això
![vscode default](/images/productivity-setup-vscode/vscode-default.jpeg)

A aquesta increïble configuració
![vscode charly3pins](/images/productivity-setup-vscode/vscode-charly3pins.jpeg)

## Tema
Sóc fan dels temes foscos, així que això era el primordial a trobar per a mi. He provat alguns com el [Cobalt2](https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2), [The Best Theme](https://marketplace.visualstudio.com/items?itemName=kohlbachjan.the-best-theme) o fins i tot un més "boig" com el [Cyberpunk](https://marketplace.visualstudio.com/items?itemName=max-SS.cyberpunk), fins que vaig trovar l'anomenat [Radical](https://github.com/DHedgecock/radical-vscode/). És simplement el perfecte per a mi. Un tema fosc, un toc futirista retro amb colors de neó subtils i la combinació de blau fosc per al fons i blau amb gris per al text juntament amb el verd, groc i rosa. Té la paleta de colors ideal per a mi.
![radical theme](https://raw.githubusercontent.com/DHedgecock/radical-vscode/master/assets/banner.png)

## Font
He instal·lat la [Hermit](https://github.com/pcaro90/hermit) com la meva font per a l'editor. No m'agraden els lligams, així que vaig tractar de trobar una que tingués monoespai que fos clara i llegible i vaig trobar aquesta font que realment m'agradava. També l'estic fent servir en el meu terminal que probablement aviat publicaré un post sobre com el tinc configurat. A més, per als més curiosos, la mida de la font que estic fent servir és de 14.
![hermit font](/images/productivity-setup-vscode/hermit-font.jpeg)

Si desitja trobar la seva font preferida, li recomano que visiti el següent lloc web https://www.programmingfonts.org, on pot veure en una demostració en viu totes les fonts i els enllaços als seus llocs web.

## Icones
Anteriorment, havia instal·lat algunes extensions de Material icons, però actualment estic fent servir les icones per defecte [Seti](https://marketplace.visualstudio.com/items?itemName=qinjia.seti-icons) per a VS Code.
![seti icons](https://github.com/hellopao/vscode-seti-icons/raw/master/screenshot.png)

## Extensions
Les extensions que tinc instal·lades a dia d'avui en el meu editor són les següents:
![extensions](/images/productivity-setup-vscode/vscode-extensions.jpeg)

1. [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
![auto rename tag](https://github.com/formulahendry/vscode-auto-rename-tag/raw/master/images/usage.gif)

Proporciona un gran estalvi de temps quan està treballant amb HTML o XML perquè canvia el nom de les etiquetes d'obrir / tancar al mateix temps que està editant una d'elles.

2. [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)
![bracket pair colorizer 2](https://github.com/CoenraadS/Bracket-Pair-Colorizer-2/raw/master/images/example.png)

Ajuda molt per identificar els parells de paréntisis o claus en el seu codi, colorejant-los amb el mateix color. A més, si posa el seu cursor dins d'un bloc, veurà com li subratlla la línia d'inici i la connecta al parèntesi o clau de tancament amb una línia vertical del mateix color. Realment és molt útil!

3. [Colorize](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)
![colorize](https://raw.githubusercontent.com/kamikillerto/vscode-colorize/master/assets/demo.gif)

Si el seu arxiu conté un codi de color, aquesta extensió ressaltarà aquest codi amb el color.

4. [Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code)

Simplement el suport del llenguatge Dart per a l'editor.

5. [Flutter](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter)
![flutter](https://dartcode.org/images/marketplace/flutter_hot_reload.gif)

Simplement el suport del llenguatge Flutter per a l'editor.

6. [Go](https://marketplace.visualstudio.com/items?itemName=golang.Go)
![go](https://github.com/golang/vscode-go/raw/master/docs/images/completion-signature-help.gif)

Simplement el suport del llenguatge Go per a l'editor.

7. [Live Share](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare)

Li permet editar col·laborativament amb altres en temps real, independentment dels llenguatges de programació que faci servir o els tipus d'aplicacions que estigui construint. Li permet compartir de forma instantània i segura el seu projecte actual en un nou espai de treball. Els desenvolupadors que s'uneixen a les seves sessions reben tot el seu context de l'editor del seu entorn (per exemple, serveis d'idiomes, depuració), el que garanteix que puguin començar a col·laborar de manera productiva immediatament, sense necessitat de clonar cap repositori o instal·lar qualsevol SDK.

![live share](https://aka.ms/vsls/quickstart/invite)

8. [Radical](https://marketplace.visualstudio.com/items?itemName=dhedgecock.radical-vscode)

El tema ja explicat en la seva secció.

9. [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)

Destaca els TODOs dins d'el codi per fer-los més visibles una vegada que está llegint el codi.

![todo highlight](https://github.com/wayou/vscode-todo-highlight/raw/master/assets/material-night-eighties.png)

10. [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)

Mostra els TODO i FIXME en una vista d'arbre en el panell de l'Explorador. Al fer clic en un TODO dins de l'arbre, s'obrirà l'arxiu i li col·locarà el cursor a la línia que contingui el TODO.

![todo tree](https://raw.githubusercontent.com/Gruntfuggly/todo-tree/master/resources/screenshot.png)

11. [vscode-proto3](https://marketplace.visualstudio.com/items?itemName=zxh404.vscode-proto3)

Simplement el suport del llenguatge proto3 per a l'editor.

![vscode proto3](https://github.com/zxh0/vscode-proto3/raw/master/images/gif1.gif)
