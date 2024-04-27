+++
title = "¿Por qué usar Go(lang)?"
date = "2023-12-05"
author = "charly3pins"
description = "Me han preguntado muchas veces por qué estoy usando Go, qué me aporta y cuáles son los motivos por los que sigo con este lenguaje de programación. Voy a intentar responder a esta pregunta, en teoría, de forma sencilla, con los principales motivos por los que me sigue fascinando."

tags = ["go"]

image = "/images/gopher-nerdy.png"
+++
## Primer contacto
Han pasado aproximadamente 8 años desde que comencé a jugar con Go. En ese momento conocí a un compañero que había dejado mi puesto de trabajo para probar suerte en un nuevo reto en su carrera profesional. Un día hablando con él me dijo que habían decidido usar un lenguaje de programación llamado Go y que estaba encantado con lo fácil que era hacer las cosas que con Java, el lenguaje que estábamos acostumbrados a usar, era tremendamente burdo y en ocasiones complejo. , debido a la cantidad de capas y repeticiones que tienes que agregar. Fue entonces cuando le dije que me mostrara cómo funcionaba y dónde conocí a Go.

Intenté crear alguna API con un servidor HTTP y en cuestión de minutos la tenía funcionando y ejecutando curls sin ningún problema. Ese mismo año, unos meses después, tuve la oportunidad de participar en un proyecto de automatización operativa donde él trabajaba y lo hicimos configurando varias API en Go. Comunicándose entre ellos, también con algunas herramientas de AWS como AWS Lambda codificadas en Go. El proyecto fue un éxito y la empresa más grande decidió comprarlo.

Después de eso, continué trabajando con Go en mi siguiente (actual) empresa donde trabajé, construyendo un entorno verdaderamente de microservicios con Go como lenguaje principal en Backend reemplazando un monolito de Typecript.

¿Por qué hemos elegido "Ir"? Permítanme intentar enumerar algunas cosas que nos hicieron elegir Go frente a otros lenguajes de programación.

## Manifiesto
Vaya, "el código es muy obvio", existe el chiste de que es un código aburrido, y eso es fantástico.

Go es un "lenguaje rápido" realmente. Debido a que Go está compilado, naturalmente superará a los lenguajes interpretados o que tienen tiempos de ejecución virtuales. El tiempo de compilación es extremadamente rápido y el binario resultante es muy pequeño. Eso le permite implementar varias veces al día, por lo que sigue perfectamente la metodología DevOps.

La "sintaxis de Go es pequeña pero potente", por lo que es fácil de aprender. Puede caber la mayor parte en su cabeza, lo que significa que no necesita perder mucho tiempo buscando cosas. También es muy limpio y fácil de leer. Los programadores que no son Go, especialmente aquellos acostumbrados a una sintaxis de estilo C, pueden leer un programa Go y generalmente entienden lo que está pasando.

Go es un "lenguaje fuertemente tipado estáticamente". Hay tipos primitivos como int, byte y string. También hay estructuras. Como cualquier lenguaje fuertemente tipado, el sistema de tipos permite al compilador ayudar a detectar clases enteras de errores. Go también tiene tipos integrados para listas y mapas, y son fáciles de usar.

Go tiene "interfaces", y cualquier estructura puede satisfacer una interfaz simplemente implementando sus métodos. Go también tiene funciones de primera clase, que abren la posibilidad de escribir tu código en un estilo más funcional.

Go tiene una buena "biblioteca estándar", por lo que normalmente los programas Go tienen pocas dependencias externas. Proporciona útiles funciones integradas para trabajar con tipos primitivos. Algunos paquetes facilitan la configuración de un servidor web, el manejo de E/S y la manipulación de datos. La serialización y deserialización JSON proporcionada por la biblioteca estándar es trivial.

Go hace que la "concurrencia" sea más fácil que en otros lenguajes. Usar rutinas y canales es casi trivial, aunque son posibles patrones más complejos.

Go proporciona soporte de "pruebas" listo para usar en su biblioteca estándar. No hay necesidad de una dependencia adicional. Si tiene un archivo llamado thing.go, escriba sus pruebas en otro archivo llamado thing_test.go y ejecute "go test". Go ejecutará esas pruebas automáticamente.

Las "herramientas de análisis estático" de Go son numerosas y sólidas. Uno en particular es `gofmt`, que formatea tu código según el estilo sugerido por Go. Dado que existe un formato de código único y una excelente biblioteca estándar, puede concentrarse en crear valor comercial, sin discutir dónde colocar esta condición o cómo definir esa estructura de datos.

Go proporciona una "memoria segura" que asigna objetos dinámicos y los "recoge basura", todo lo cual es más simple que C y C++. Además, hace que el uso de punteros sea mucho más seguro porque no permite la aritmética de punteros. También le da la opción de utilizar tipos de valores.

**Bonus**
El estilo de codificación Go sigue la [línea de visión](https://medium.com/@matryer/line-of-sight-in-code-186dd7cdea88): la idea es que al final de tu función, debería estar el feliz camino, por lo que está en el borde izquierdo. Cualquier otra cosa, ya sea un error o un caso extremo, no es el camino feliz, por lo que debes sangrarlo. Con eso, el código es súper legible y fácil de seguir, y no es necesario usar "else" probablemente en el 99% de los casos. Cuando tienes frente a ti el código Go y ves que hay una parte del código sangrada, sabes que esa es la salida de la función y el camino feliz está en el borde izquierdo.

Sencillo, limpio, genial, ¡VAMOS!

Espero que haya quedado claro todo lo que he intentado explicar en este post, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantada de responderte.
