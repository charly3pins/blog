+++
title = "Tournaments generator"
date = "2020-05-01"
author = "charly3pins"
description = "Prueba de concepto de la construcción de una aplicación para administrar torneos FIFA 20 entre diferentes personas usando Flutter para construir una aplicación móvil y Go para construir una API que actúa como servidor. También usé Python para construir raspadores simples."

weight = "2"

tags = ["go", "flutter", "python", "postgresql"]

image = "/images/code/tournaments-generator/home.png"
+++
## POR QUÉ

La motivación para iniciar este proyecto no es otra que mi curiosidad por las aplicaciones móviles. Es obvio que la forma de consumir tecnología ha cambiado en los últimos años y cada vez se hace más a través de un dispositivo móvil. Por esa razón, quería explorar cómo funcionan las aplicaciones móviles y cómo puedo crear una desde cero.
Hice algunos tutoriales de Android, pero como están cambiando muchas cosas al lanzar nuevas versiones y mi idea era crear algo genérico para todos los dispositivos, decidí intentarlo con [Flutter](https://flutter.dev/).

Estaba entre [React Native](https://reactnative.dev/) o Flutter, pero después de leer algunos pros y contras, decidí aliarme con Flutter. Comencé a leer su [documentación](https://flutter.dev/docs) y era muy similar a Android (están usando Dart en la parte inferior) y comencé a recordar mis viejos tiempos en los tutoriales de Android y me gusta, así que Yo continué. Después de unos días leyendo solo documentación técnica, continué con la aplicación "hello world" [tutorial](https://flutter.dev/docs/get-started/codelab) que proporcionan en el sitio web. Y finalmente, estaba listo para comenzar mi propio proyecto.

Para cuando comenzó la pandemia mundial, mis amigos y yo comenzamos una liga FIFA 20 en PS4 para distraernos por las tardes / noches. Inicialmente solo se trataba de jugar y nada más, pero luego comenzamos a tener un panel de Power BI para estadísticas, un canal de YouTube para compartir los juegos en vivo y luego almacenarlos allí y un Twitter para tuitear las actualizaciones de la clasificación cada semana. La primera liga se creó de forma manual y un poco dolorosa y súper estática, así que decidí usar ese tema para crear una aplicación que nos ayude a administrar la segunda liga creando la liga, administrando nuestros equipos y partidos allí, notificando los resultados. y mostrando estadísticas más detalladas en su interior.

## QUÉ

En primer lugar, quería poner toda la información real de FIFA 20 dentro del sitio web relacionada con ligas, equipos y jugadores. Para eso encontré algunos sitios web que tienen esa información abierta y gratuita, pero no tienen una API para consumirla. La idea de copiar manualmente era muy tentadora, pero preferí escribir un rastreador simple en [Python](https://www.python.org/) usando la biblioteca [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/#css-selectors) con los css-selectors que proporciona. Haciendo algunos ajustes aquí y allá, al final terminé teniendo 3 archivos json, uno para cada tema que quería inicialmente, ¡así que todo perfecto!

Luego, para poder introducir toda esa información en la base de datos, la idea fue crear una herramienta de línea de comandos que lea esos archivos y genere las correspondientes declaraciones SQL y luego genere los archivos de migración correspondientes.
Elegí [Go](https://golang.org/) como lenguaje de programación para la API y creé un `cmd` que me permite hacer la idea deseada. La base de datos sería [PostgreSQL](https://www.postgresql.org/) por lo que las "inserciones" tienen que estar de acuerdo con su sintaxis.

Con todos los datos iniciales listos, comencé a diseñar el resto de la base de datos y los posibles puntos finales lo necesitan para administrar toda esa información. Elegí [mux](https://github.com/gorilla/mux) para HTTP por su simplicidad pero potente en comparación con la lib estándar (solo para el análisis de parámetros vale la pena ...). Como quería explorar más el lado de la aplicación móvil que el lado del servidor, simplemente organicé el código usando la [Arquitectura de capas](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01 .html) agrupando los elementos por función y usé [GORM](https://gorm.io/index.html) como el ORM para simplificar la consulta y las asignaciones entre la base de datos y mis modelos.

![api structure](/images/code/tournaments-generator/api-structure.jpeg)

Dentro de la carpeta `cmd` he creado diferentes comandos:
- migración: gestiona las migraciones en la base de datos
- analizador: traduce el json del rastreador en sentencias sql
- servidor: ejecuta el servidor

Dentro de la carpeta `pkg` es fácil identificar qué están haciendo las carpetas por su propio nombre.

Para la aplicación móvil, comencé a poner todos los archivos dentro de una carpeta de `componentes`, pero cuando comenzó a crecer, fue una tarea difícil de administrar. Después de agregar más complejidad a la aplicación, termino encontrando una forma limpia de organizar el código, dividiéndolo en dos carpetas separadas; uno para el núcleo y otro para la interfaz de usuario. Luego dentro de cada uno también categoricé los diferentes tipos de componentes en función de sus responsabilidades y al final el código (al menos para mí que no soy un experto en Flutter) terminó luciendo súper limpio y (sin duda) más mantenible . Debajo de la organización de carpetas en una vista general:

![app structure](/images/code/tournaments-generator/app-structure.jpeg)

Al principio, cuando comencé a codificar y ver los resultados, todo fue súper elegante y pensé que era más fácil de lo esperado. Conectar la aplicación con la API fue solo una cuestión de saber cómo usar la biblioteca `http` y los métodos` get` o `post` se conectaron sin problemas.

```dart
    var client = new http.Client();

    String jsonBody = json.encode(user.toJson());
    var response = await client.post("$_baseUrl/token",
        headers: {"Content-Type": 'application/json'}, body: jsonBody);

    if (response.statusCode == 200) {
      return User.fromJson(json.decode(response.body));
    }
```

El único problema al que me he enfrentado allí es que estaba ejecutando las aplicaciones desde el emulador de Android; eso significa que se estaba ejecutando en una máquina virtual, por lo que la IP no era mi local y no puede acceder al `localhost`. Después de un poco de investigación, encontré el correcto y todo funcionó correctamente.

Los problemas comenzaron cuando quería pasar información entre componentes y actualizar la vista en función de esa información, o mejor aún, no actualizar si nada cambia cuando entro de nuevo en una vista (por ejemplo, al pasar de una lista a una vista de detalle, y volviendo de nuevo a la lista). Después de un día leyendo en foros sobre el mismo problema al que me estaba enfrentando, encontré el paquete [Proveedor] (https://pub.dev/packages/provider) y todo parecía fácil y el santo grial para todo, pero no lo era.

¡El verdadero dolor acaba de comenzar allí! Me tomó algunos días entender realmente cómo funciona. El proveedor inicial es fácil de entender y lo usa y funciona, pero luego desea cambiar solo una pequeña parte de la vista, o desea reconstruir la totalidad, o desea modificar algunos valores en una vista A y luego vaya a la vista B y vea los cambios allí, y todos esos ejemplos está codificado de manera completamente diferente y primero debe saber que hay una forma para cada caso de hacer las cosas y segundo, debe saber cómo hacerlo. Al final utilicé Provider, ProxyProvider, StreamProvider y ChangeNotifierProvider.

El proyecto no está terminado pero por ahora está En Espera con las siguientes funcionalidades:

Inicialmente, el usuario puede cambiar entre las vistas de registro / inicio de sesión.
![signup](/images/code/tournaments-generator/signup.png)
![login](/images/code/tournaments-generator/login.png)

Una vez que el usuario está dentro de la aplicación esta tiene diferentes pestañas donde los próximos `Partidos` tiene que jugar, los` Torneos` que está jugando y los `Grupos` donde está presente y los miembros dentro. En la parte superior tiene una barra de navegación con una foto de perfil, un ícono de campana para las notificaciones, un ícono de lente para buscar a otros miembros y agregar como sus amigos y el botón de cierre de sesión para desconectarse.
![home](/images/code/tournaments-generator/home.png)

Si hace clic en la foto de perfil va directamente al perfil del usuario donde muestra los amigos y donde puede editar su información personal (nombre, nombre de usuario, foto de perfil):
![profile](/images/code/tournaments-generator/profile.png)

Al presionar el ícono de la lente, cambia la vista a la funcionalidad de súper buscador que permite al usuario encontrar a otras personas que ya están en la plataforma, agregarlas como sus amigos y luego crear grupos, generar torneos y jugar partidos juntos. El buscador es una búsqueda de "me gusta", por lo que si alguna de las letras que introduce aparece en algún nombre de usuario, entonces se muestra allí.
![searcher](/images/code/tournaments-generator/searcher.png)

Luego de eso, si el usuario ingresa a un perfil que no es amigo, aparecerá el botón para agregarlo y si se hace clic, ocultará ese botón y mostrará la información de que ya hay una solicitud enviada, esperando al otro usuario. para contestarlo.
![add friend](/images/code/tournaments-generator/add-friend.png)
![add friend requested](/images/code/tournaments-generator/add-friend-requested.png)

Actuando como el otro usuario, al iniciar sesión, el icono de campana mostrará una nueva notificación. Entrar aparece como una notificación de amigo y se puede responder directamente desde la lista o entrar en el perfil de "solicitante" y aceptar / rechazar allí. Si se acepta la solicitud de amistad, aparecerá como un nuevo amigo en el perfil del usuario.
![friend request notification](/images/code/tournaments-generator/friend-request-notification.png)
![friend request notification answer](/images/code/tournaments-generator/friend-request-notification-answer.png)
![profile multi friends](/images/code/tournaments-generator/profile-multifriends.png)

Después de que un usuario tiene algunos amigos, es el momento en que puede crear un grupo. Para eso la aplicación tiene la tercera pestaña llamada `Grupos` y un botón (+).
![new group](/images/code/tournaments-generator/new-group.png)

Dentro del generador de grupos, mostrará la lista de amigos en la parte superior. A medida que se seleccionan, se colocan en la lista siguiente, donde se pueden eliminar si se desea; cuando se seleccionan todos los amigos, es hora de pasar a la siguiente pantalla con el botón (-->).
![new group selected](/images/code/tournaments-generator/new-group-selected.png)

El siguiente paso es poner un buen nombre para ese grupo y luego presionar la casilla uno para crear el grupo.
![new group name](/images/code/tournaments-generator/new-group-name.png)

Cuando el usuario regresa a la vista de inicio, aparece el nuevo grupo creado y sus miembros en la lista.
![new group created](/images/code/tournaments-generator/new-group-created.png)

A partir de aquí lo que falta es crear los `Torneos` seleccionando el grupo y los miembros de ese grupo que quieren jugar, el número de equipos para cada integrante, los equipos, las rondas, el tipo de torneo, etc. y luego generar el calendario. Muestre el calendario en la pestaña `Partidos` y dentro de cada partida permita a los usuarios agregar los resultados. También proporcione una clasificación y las estadísticas de cada partido y una agrupada para cada encuentro y una genérica.

## PENSAMIENTOS FINALES

Con esta prueba de concepto tuve la oportunidad de trabajar en una aplicación compleja en términos de diseño de componentes reutilizables en una aplicación móvil, llamar a una API externa para administrar la información que se muestra en la aplicación y aprender a usar el paquete Provider para mover información. entre múltiples vistas y controlar el estado de la aplicación de una forma más sencilla y eficaz.

Hay mucho más que aprender con respecto al desarrollo móvil, pero considero este proyecto como un paso inicial para empezar. Algún día haré las vistas que faltan para que podamos usarlas en el mundo real, pero espero que no sea porque tengamos otra pandemia 😏

- Código fuente de la API en Go: https://github.com/charly3pins/fifa-gen-api
- Código fuente de la app en Flutter: https://github.com/charly3pins/fifa_gen