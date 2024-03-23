+++
title = "Qué aprendí definiendo el Proceso de Selección para Ingeniero de Software en la startup donde trabajo"
date = "2021-05-04"
author = "charly3pins"
description = "Aprendizaje y consejos que puedo compartir contigo despues de tres meses entrevistando a distintos candidat@s."

tags = ["life", "startup"]

image = "/images/software_engineer_word_cloud.jpg"
+++
## Introducción 

Trabajo en [AREX Markets](https://arex.io) desde Noviembre 2018 y desde entonces, la empresa ha cambiado mucho. Cuando entré eramos un equipo que no llegaba  a 10 personas (~5 técnicas) y ahora somos cerca de las 50. El ambiente de las startup siempre me ha gustado más que el de una gran compañía por todos los retos que eso conlleva. Tienes que hacer muchas cosas y estar involucrado en muchos temas, ya sean de tu puesto de trabajo u otros no relacionados, y eso me gusta mucho. Durante las últimas semanas, o mejor dicho meses, hemos estado entrevistando a mucha gente ya que estamos creciendo en términos de negocio y necesitamos necesitamos escalar el equipo técnico, así que comenzamos con la contratación de más ingenier@s de software.

El primer paso fue definir qué tipo de **Proceso de selección** queríamos seguir. Lo hicimos todo el equipo juntos y eso fue lo primero de valor que pudimos extraer. Si pretendes definir un proceso de selección en tu empresa sin el aporte del equipo que participará en él, eso es malo. Todos deben dar su opinión y participar en esa parte, ya que más adelante serán parte de ella y, si todo sale bien, el nuevo miembro se unirá al equipo, por lo que deben sentirse cómodos con la decisión.

Dicho esto, seguro que te estás preguntando ¿cuál es ese proceso? Permíteme resumirlo en las siguientes líneas.

## Proceso de Selección

*-* En primer lugar, el responsable de contratación tiene una **llamada** con el candidato para explicarle los detalles del equipo, el stack tecnológico, las tareas que va a asumir y básicamente conocerlo y aclarar las posibles dudas que pueda tener.

*-* Si la llamada va bien, el siguiente paso es hacer la **Prueba técnica**. Para esto ofrecemos 3 opciones:

- **Prueba técnica**. Reto clásico que le envías al candidato un ejercicio para resolver en X días.

- **Portafolio técnico**. Si el candidato tiene un/varios proyecto(s) que cubre(n) los requisitos mínimos esperados en la prueba tećnica, puede compartirlos con el equipo en lugar de realizar dicho reto. (Por ejemplo: compartir el repositorio en GitHub).

- **Sesión de programación en vivo**. Invitación al candidato a hacer una sesión de programación juntos en nuestra oficina. (Por razones obvias durante este año esta opción no ha sido posible).

*-* **Revisión técnica**. El equipo revisa el código del candidato y tiene una llamada con él donde dan feedback del código revisado y hacen preguntas y aclaran dudas al candidato más enfocado en el equipo y la parte tecnológica.

*-* **Entrevista de Producto**. Si la revisión técnica se supera, el último paso es una llamada con el equipo de Producto para ver si el candidato, además de tener las habilidades técnicas necesarias (validadas en la fase anterior), tiene la mentalidad y actitud que el equipo necesita.

*-* **Comentarios finales**. Después de la última llamada, el candidato recibe feedback tanto si es contratado o no. Según el caso es una llamada o un correo electrónico.

Como se puede ver, el proceso no es súper innovador ni disruptivo, pero es el que todos acordamos y con el que nos sentimos cómodos trabajando. Una cosa que quiero destacar es la fase de la parte técnica. Todos hemos estado en entrevistas antes y queríamos hacer el proceso que nos hubiera gustado encontrar si hubiéramos sido los entrevistados. Por esa razón, ofrecimos la opción de mostrar el código ya hecho en lugar de pedir una prueba técnica "sí o sí". Eso era una parte imprescindible porque todos hemos pasado muchas horas haciendo una prueba técnica y luego terminamos sin ningún comentario, solo un correo electrónico diciendo "gracias por participar, pero lamentamos que no seas el elegido". Ese es el primer punto y el segundo está relacionado con la última frase. Acordamos hacer una llamada telefónica a todos los candidatos que presentaran la prueba técnica, aunque no nos gustase o tuviéramos dudas, la llamada era imprescindible. Fracasamos en esa parte porque al final, con muchos candidatos a la vez, tuvimos que cancelar, creo, 2-3 llamadas, pero para el 90% restante lo hicimos. Eso fue realmente útil para nosotros para aclarar las dudas durante la revisión del código y hacer más preguntas y profundizar en algunos temas con los candidatos. También para ver cómo reaccionan ante el feedback positivo/negativo y el tipo de respuestas o argumentos que intentaron usar para justificar las cosas incorrectas. Eso fue realmente productivo en mi opinión y la parte que más disfruté en todo el proceso. Además, el feedback final era otra cosa obligatoria para nosotros por lo que elaboramos una lista con las cosas que queríamos comentar aunque fuese un candidato rechazado, pero con el fin de darle la mayor información posible para saber por qué no lo elegimos.

## Revisión del código

Centrándome en las revisiones del código, elaboré una lista con las cosas más comunes que encontramos durante esa fase y creo que es importante compartirla ya sea de cara a si eres entrevistador pero también si te van a entrevistar y estás en la parte del desafío técnico, verifica estos puntos antes de enviarlo:

*-* **README pobre**. Este fue el mayor problema que encontramos en todos los candidatos. Excepto unos pocos, la mayoría proporcionó un README muy breve sin indicaciones sobre cómo ejecutar el proyecto, o no lo suficientemente detallado. No indicar las dependencias necesarias (si necesita descargar o instalar algo para ejecutarlo). No explicar los comandos (si se proporciona Makefile). No explicar de qué se trata el proyecto (especialmente importante con los que no estaban resolviendo nuestro Tech Challenge). Falta de TODO con las cosas pendientes que no fueron posibles de cubrir pero agregadas allí como una invitación para ser discutidas en la llamada de revisión técnica.

*-* **Tests que fallan**. Algunas de las pruebas, afortunadamente solo algunas, no pasaban sus propios tests. Básicamente, eso significa que el candidato no los ejecutó antes de enviar la prueba y eso es una señal de alerta para ese apartado.

*-* **Muy pocos comentarios en todo el código**. Seré honesto contigo, no me gustan los comentarios en el código. Para mí, un código que necesita comentarios es un código complejo. Por lo tanto, el código debe ser lo suficientemente simple como para que sea comprensible sin comentarios, de lo contrario, se está complicando demasiado. Dicho esto, en Go la documentación se autogenera para los tipos, funciones, métodos, etc... exportados a partir de los comentarios. Así que estos comentarios son los que acepto y personalmente creo que son necesarios para entender el contexto, pero no los comentarios como "conseguir usuario" una línea encima de "repo.getuser()".

*-* **Código comentado**. Algunas pruebas llegaron con mucho código comentado. No los comentarios que estaba diciendo antes que son para documentar. Me refiero al código comentado con `//` o bloques completos `/* */`. Todos sabemos que para las pruebas técnicas en específico, por lo general, el tiempo que se tiene es limitado, ya que estás trabajando en un sitio y quieres cambiar. Además te apuntas a varias ofertas a la vez para tener más opciones. Por lo tanto, puedes terminar con N pruebas para entregar durante la misma semana, además de tu trabajo diario y tu "vida real". Pero si revisas rápidamente tu código, encontrarás fácilmente si comentaste algún trozo de código solo para probarlo o para una primera idea y luego lo desechaste. En ese caso bórralo antes de enviarlo.

*-* **Valores harcoded**. En relación con el punto anterior, hubo muchos desafíos con valores harcoded que hicieron que el equipo de revisión de la prueba tuviera que tocar el código para poder ejecutarlo o hacer que los tests pasaran. En la medida de lo posible, intenta utilizar variables de entorno o proporcionar un archivo de configuración. Y si nada de eso es posible, al menos agrega una sección en el README con las cosas que quizá se deban modificar ya que solo funcionarán en tu local.

## Resultados

Una vez aplicado todo esto y haber iterado el proceso durante estos meses los números creo que son bastante buenos. Hemos hecho todos un esfuerzo muy grande dedicando mucho tiempo al proceso de selección ya sea buscando candidatos, estando en llamadas telefónicas, revisando código o dando feedback sobre los candidatos. Hemos conseguido aumentar el equipo en aproximadamente ¡12 personas en 3 meses! En el futuro tengo pensado publicar un nuevo post sobre cómo hemos organizado los equipos y cómo ha ido la integración de todos los compañeros/as nuevos/as que han entrado en el equipo.

Comenta tus aprendizajes y consejos durante tus procesos de Selección o entrevistas aquí o contáctame en mis redes sociales para cualquier comentario, pregunta o sugerencia para que todos podamos aprender unos de otros y mejorar los procesos de selección de nuestro sector.
