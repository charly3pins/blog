+++
title = "Gestión de contenidos y plantillas con Hugo"
date = "2020-03-08"
author = "charly3pins"
description = "Cómo organizar tu contenido y crear tus plantillas para obtener el máximo valor de Hugo."

tags = ["hugo"]

image = "/images/gohugoio-card.png"
+++
Después de mucho tiempo sin escribir... ¡estoy de vuelta!

![I'm back](/images/hugo-content-templates-managing/im-back-terminator.jpg)

Estaba planeando reconstruir mi sitio y comenzar a crear contenido nuevamente, pero nunca encontré el tiempo hasta ahora.

Quería hacer mi tema desde cero en lugar de usar un [tema predefinido](https://themes.gohugo.io/), así que tuve que aprender cómo se realizan las plantillas y la gestión de contenido en Hugo.

Una vez que hice ese proceso, quiero resumir las cosas más importantes que considero que debes saber si quieres hacer tu propio tema como lo hice yo (¡este sitio es la prueba de eso!).

## Gestión de contenido

Primero que nada hablemos de la [organización de contenido](https://gohugo.io/content-management/organization/) en Hugo.

Todo el contenido que desee tener en su sitio debe estar dentro del directorio `content/`. Simplemente coloque sus publicaciones dentro de `content/posts` y su descripción en `content/about` y Hugo hará la magia por usted. Suena fácil, ¿verdad? Continúe entonces.

Hugo tiene principalmente dos tipos de páginas, las "únicas" y las "múltiples". Los primeros se utilizan por ejemplo para un `about` o para un `faq` o una `contrib` o un `landing`... Los segundos se utilizan cuando se desea agrupar en una misma categoría diferentes contenidos. Por ejemplo, sus diferentes publicaciones para sus "publicaciones" o un catálogo para sus "productos". Dicho esto, hay otra diferencia que debes conocer cuando creas tus diferentes páginas.

Los únicos tienen que ser nombrados como `index.md`, los de la lista no. Esto al final le indica a Hugo cómo administrar el contenido dentro de los directorios y cómo generar las URL para acceder a ellos. El siguiente esquema demuestra cómo funciona:

```
└── content
    └── about
    |   └── index.md        (https://mysite.com/about)
    ├── posts
    |   ├── first-post.md   (https://mysite.com/posts/first-post)
    |   └── second-post.md  (https://mysite.com/posts/second-post)
    |   └── trips
    |       └── pandora.md  (https://mysite.com/posts/trips/pandora)
    └── faq
        └── index.md        (https://mysite.com/faq)
```

También existe la posibilidad de especificar la URL usando la propiedad `slug` como slug=" my-custom-url ".

## Gestión de plantillas

Ahora que sabes cómo organizar tu contenido, es hora de hablar sobre las [plantillas](https://gohugo.io/templates/). Son el código HTML que genera las páginas de su sitio. Hay algunos trucos y consejos que quiero compartir con ustedes como lo hice con el contenido de la sección anterior.

Las diferentes plantillas deben colocarse dentro del directorio `layouts/`. En la raíz debe estar la plantilla principal llamada `index.html` utilizada para representar la página de inicio. De la misma forma que el contenido, las plantillas se pueden organizar en carpetas si desea mostrar de diferentes formas el contenido según la ruta. Al igual que el contenido, las plantillas se pueden organizar entre únicas y múltiples. Tomando la organización de contenido descrita anteriormente, considerando que desea especificar diferentes plantillas para cada carpeta de contenido, una de las posibles organizaciones de plantillas puede ser:

```
└── layouts
    └── _default_
    |   ├── list.html
    |   └── single.html
    └── posts
        ├── list.html
        └── single.html
        └── trips
            ├── list.html
            └── single.html
```

Analizando en detalle, se puede ver un árbol similar al contenido pero con la particularidad de que no hay carpetas `about` ni` faq` pero que parecía una `_default`. Hugo usa esta carpeta especial para renderizar las páginas que no tienen su propia plantilla. En ese caso, el about y el faq, ambos tipos únicos, se renderizarán utilizando la plantilla `layouts/_default/single.html`. Si el directorio `trips` no existiera, las plantillas utilizadas serán las de `_default`.

En este punto, ya conoce la organización de contenido y la gestión de plantillas, pero está pensando:
> ¿Cómo sabe Hugo cuando quiero usar una página única o una lista?

La respuesta depende de la URL y el contenido allí. Utilizando de nuevo el ejemplo anterior para la organización del contenido, si observa que `about` contiene un` index.md`, eso indica que Hugo es una página "única". Como no definimos ninguna plantilla en particular para eso, la que se utilizará es la genérica `_default/single.thml`.

Por otro lado, dentro de las `posts` hay tres publicaciones pero ninguna `index.md` una, lo que indica a Hugo que es una página "múltiple", por lo que usarás ambas plantillas, la `list.html` como un "índice" de tus publicaciones y el `single.html` para cada publicación. Para renderizar el `list.html` tienes que ir a la URL del directorio (https://mysite.com/posts/). Para las publicaciones (https://mysite.com/posts/first-post) y (https://mysite.com/posts/second-post) la plantilla utilizada será `single.html`.

### Variables de página

Las páginas tienen un conjunto de variables útiles que es bueno conocer:
- Title: el título de la publicación
- Description: una descripción corta o larga de la publicación
- Content: el cuerpo de la publicación.
- ReadingTime: los minutos que Hugo autocalcula para leer la publicación

Para acceder a los parámetros personalizados que puede crear en cada publicación, debe acceder a ellos por su nombre dentro del objeto `Params` (Params.yourParam).

Puede mostrar publicaciones relacionadas leyendo los resultados del `.Site.RegularPages.Related`.

Consulte la lista completa en la página [documentación](https://gohugo.io/variables/page/).

La plantilla `list.html` se usa para mostrar una breve descripción de las publicaciones como un índice de libros con los enlaces a la publicación real. Para hacer eso, tienes que acceder a la variable `$.Paginator.Pages` y recorrer los resultados. Las variables son las mismas descritas anteriormente con un `Permalink` más, el que necesitas usar para acceder a la publicación (y llamar a la plantilla `single.html`) para ese contenido.

También existen las variables `PrevInSection` y` NextInSection` para paginar los resultados.

### Plantillas parciales

El último consejo que quiero explicarte es que no necesitas repetir todo el tiempo todas las partes de las plantillas, puedes extraer la parte común en una plantilla y luego reutilizarla donde quieras. Estas son las [plantillas parciales] (https://gohugo.io/templates/partials/). Su particularidad es que necesitas colocar esa parte dentro de un directorio `partials/` y llamarlo como `{{partial" nombre.html ". }} `. Son útiles para el `header`,`footer`, `navbar` y otras partes genéricas, así como para una plantilla de lista que desea reutilizar para sus publicaciones y para sus viajes, por ejemplo.
