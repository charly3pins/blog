+++
title = "Cómo añadir Google Analytics a tu sitio web con Hugo"
date = "2020-11-23"
author = "charly3pins"
description = "Tutorial rápido sobre cómo integrar Google Analytics en un sitio web con Hugo."

tags = ["hugo"]

image = "/images/google-analytics-hugo.png"
+++
## Google Analytics

En primer lugar, lo que necesita es obtener un ID de seguimiento de Google Analytics. Para eso, debe registrarse en [Google Analytics](https://analytics.google.com/analytics/web/). Luego, debe crear un ID de seguimiento siguiendo los siguientes pasos:

- Haga clic en el botón `Admin` (en la esquina inferior izquierda).
- Haga clic en el botón "Crear cuenta".
- Después de completar todos los pasos, haga clic en el botón "Crear" y acepte los términos y condiciones.

Después de completar estos pasos, obtendrá su ID de seguimiento. Cópielo para agregarlo a su sitio de Hugo más tarde.

## Configuración de Hugo

Ahora es el turno de agregar el ID de seguimiento a su sitio.
La forma más sencilla de hacerlo es utilizando la [plantilla interna] de Hugo (https://gohugo.io/templates/internal/#google-analytics) proporcionada por Hugo. Solo necesita agregar una nueva variable llamada `googleAnalytics` con el `tracking ID` obtenido del paso anterior en su `config.toml` como:
```vim
googleAnalytics = "UA-123-45"
```

El siguiente paso es agregar el siguiente fragmento de código en su sitio:
```vim
{{ template "_internal/google_analytics.html" . }}
```
Debería buscar la plantilla parcial `head` y agregarla dentro de las etiquetas `<head> </head>`.

## Comprobando la integración

Antes de pasar eso a producción, puede probarlo ejecutando su sitio localmente realizando el siguiente comando:
```vim
hugo serve
```

La URL predeterminada en localhost es `http://localhost:1313`.

Vuelva a abrir o actualice [Google Analytics](https://analytics.google.com/analytics/web/) en una pestaña diferente.

Verifique el tablero y debería poder ver el número en la sección Usuarios activos en este momento como 1 como la imagen a continuación:
![active-users](/images/google-analytics-active-users.png)