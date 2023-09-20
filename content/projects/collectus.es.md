+++
title = "Collectus"
date = "2018-09-22"
author = "charly3pins"
description = "Como proyecto de fin de carrera de Ingeniería Informática, construí una base de datos flexible para coleccionables y cualquier otro objeto o dato que cualquier usuario quiera ordenar y clasificar de una manera simple y efectiva."

weight = "1"

tags = ["php", "javascript", "mysql"]
+++
## POR QUÉ

La motivación de este proyecto es mitad personal y mitad académica. Dejame explicar. En casa mi padre siempre coleccionaba un montón de cosas, desde los libros más antiguos que puedas imaginar hasta el nuevo Funko POP más reciente, pasando por Swiss Knives o dados entre otros. Tener esa variedad de objetos y muchos de ellos (demasiados para ser honestos) catalogar esa cantidad de artículos siempre había sido un desafío para él.

Siempre trató de clasificar de diferentes formas como usando un Excel, aplicaciones gratuitas, aplicaciones de pago, etc. Al final cada vez que sucede algo similar, el hándicap de su "colección de colecciones" (como él lo describe) es demasiado singular, y no cabe en ningún lado. Él es desarrollador y yo estaba en mi último año en la Universidad estudiando Ingeniería en Ciencias de la Computación, así que comenzamos a planear cómo podríamos resolver ese problema haciendo nosotros mismos la aplicación.

Después de unos días / semanas me di cuenta de que pronto tendría que elegir un proyecto para presentar como mi Proyecto de Fin de Año, así que decidí darle una oportunidad a esta idea loca y familiar y proponérsela a mi tutor. Estaba emocionada con la idea que teníamos y aceptó feliz.

Una vez que tuve la aprobación de mi tutor, fue una novedad asombrosa porque el proyecto personal que queríamos desarrollar en nuestros tiempos libres, ahora tuve la oportunidad de dedicar todo mi esfuerzo no solo a resolver el problema que teníamos, sino a presentarlo. como proyecto final. Y así empezó todo.

Al final el proyecto terminó siendo súper exitoso, mi tutor quedó encantado con el resultado, y al tribunal le gustó mucho, incluso me dijeron que les enviara un correo cuando lo pusiera en producción para que lo usen y cataloguen sus colecciones propias.

## QUÉ

Llamé a la aplicación Collectus porque es la palabra latina que significa "reunir, recolectar", por lo que en ese caso encaja perfectamente. Es un sistema de base de datos flexible para coleccionables y cualquier otro objeto o dato que el usuario quiera ordenar y clasificar. Collectus está pensado para coleccionistas, permitiéndoles realizar un seguimiento de cualquier tipo de colección que tengan, utilizando un sistema de base de datos con una estructura abierta adaptable a cada necesidad. También proporciona dos tipos de inicio de sesión para los usuarios, creando uno nuevo para la plataforma o usando su cuenta de Facebook conectándolo con la API de Facebook.

![app](/images/code/collectus/main-app.jpeg)
![login](/images/code/collectus/login.jpeg)

Mediante plantillas el usuario puede establecer todo tipo de récords para elementos tan diversos como sellos o placas de cava, carteles o fósiles, muñecos de trapo o billetes de lotería. Una vez definida la plantilla (categoría) para el objeto o tipo de objeto de interés, y el usuario puede ingresar los datos inmediatamente.

![item edit](/images/code/collectus/item-edit.jpeg)
![amazon mapping](/images/code/collectus/amazon-mapping.jpeg)

Para facilitar toda esta tarea, incorpora herramientas de ayuda al usuario. El más destacado lo proporciona la API de productos de Amazon para leer automáticamente la información de su base de datos en el momento de la entrada de datos.

![amazon search](/images/code/collectus/amazon-search.jpeg)

Desde aquí los usuarios podrán leer la información según varios criterios de búsqueda ofrecidos en la aplicación y almacenarlos. También hay una comparación de precios entre las distintas tiendas de Amazon en todos los países para encontrar diferentes precios y ayudar en la compra de artículos a los usuarios.

![amazon results](/images/code/collectus/amazon-results.jpeg)

Todo esto ha sido desarrollado bajo una atractiva GUI y la usabilidad como objetivo principal.

Lenguajes de programación y herramientas utilizadas para este proyecto:
- PHP 5, JavaScript y jQuery para el backend
- HTML y CSS para la interfaz
- AJAX como forma de llamar al lado del servidor
- API de productos de Amazon para la investigación de productos y la comparación de precios
- API de Facebook para el inicio de sesión

## PENSAMIENTOS FINALES

Fue mi primer gran proyecto como desarrollador de software construyendo una web y aprendí muchas cosas como aprender nuevos lenguajes de programación y la arquitectura de los proyectos; diseñar correctamente las bases de datos; pulir el más mínimo detalle visual; batalla con las API externas que se conectan a ellos; organizarme para entregar pequeñas partes del proyecto paso a paso en lugar de todo el proyecto a la vez; escribir la documentación apropiada sobre la funcionalidad del proyecto y probablemente muchos otros.

Siempre he querido hacer una segunda versión mejorada del proyecto, ahora con la experiencia que tengo y las habilidades que he ido adquiriendo a lo largo de estos años de trabajo. Empecé varias veces pero nunca terminé...

Espero algún día poder lanzar oficialmente la aplicación y contaros aquí. 🚀