+++
title = "Entiende el Control de Versiones Semántico 2.0 (SemVer)"
date = "2020-10-20"
author = "charly3pins"
description = "¿Qué es el control de versiones semántico? ¿Por qué es importante utilizarlo en tus proyectos como desarrollador? ¿Qué significa para un usuario que usa tu biblioteca?"

tags = ["api"]

image = "/images/semver.png"
+++
Cuando desee usar una biblioteca en su proyecto, probablemente notó que necesita especificar una versión. La mayoría de las veces, esas versiones tienen el formato de 3 números separados por puntos entre ellos. Ese formato es indicativo de que la biblioteca está utilizando el [Control de versiones semántico](https://semver.org) también conocido como SemVer. Ese documento especifica el formato y la forma de etiquetar sus proyectos durante todo el ciclo de vida del mismo. Es solo una convención para que pueda definir el número de versión de la manera que desee, pero la verdad es que otros desarrolladores de todas las industrias acordaron usarlo y se convirtió en un estándar para el control de versiones.

El objetivo es tener diferentes versiones de su paquete siguiendo la regla de que cada vez que actualice el paquete, actualice la versión. Con eso lo que logras es tener un nombre y una versión únicos para cada paquete público. Para usar SemVer, debe declarar una API pública. Esto se debe a que el control de versiones propuesto se basa en los cambios en la versión anterior de la API, por lo que si no especifica uno (incluso codificado o simplemente documentado) no es posible aplicar esas reglas.

El formato de SemVer es como se mencionó anteriormente, 3 números separados por un punto entre ellos:
`PRINCIPAL.MINOR.PATCH`

La forma de incrementar cada número se describe en el documento. Como un resumen:
- Las nuevas funciones con versiones de comportamiento incompatibles (rompe la API) incrementa el MAJOR;
- Las nuevas funciones compatibles con versiones anteriores (no rompe la API) incrementa el MINOR;
- La corrección de errores incrementa el PATCH;

NOTA: El desarrollo inicial utiliza una versión principal 0.
NOTA 2: Cuando se aumenta MINOR, el PATCH se restablece a 0; Cuando se aumenta MAJOR, MINOR y PATCH se restablecen a 0.

Como caso especial puede utilizar las versiones preliminares. Se indican añadiendo un guión y las siguientes cadenas aceptadas globalmente:
- alpha;
- beta;
- rc (release candidates);

Seguido del número de versión necesario. Entonces, las versiones preliminares deberían seguir un orden similar como:
- 1.0.0-alpha
- 1.0.0-alpha-1
- 1.0.0-beta
- 1.0.0-beta.2
- 1.0.0-beta.10
- 1.0.0-rc.1
- 1.0.0-rc.40
- 1.0.0

NOTA: Una API se considera publicada a partir de la version 1.0.0.

Cuando desee utilizar SemVer, puede especificar una versión exacta o no. Para eso puede utilizar las siguientes herramientas:
- Si desea una versión exacta, indique la dependencia con: X.Y.Z;
- Si desea utilizar la versión actual o una superior, incluso con cambios importantes en la API, puede utilizar el `>` como:> X.Y.Z;
- Si desea tener la versión actual o las actualizadas pero con compatibilidades con versiones anteriores, puede usar el `^` como: ^ X.Y.Z (donde X es fijo);
- Si desea tener la versión actual o las actualizadas solo con correcciones de errores con cambios de nivel menor, puede usar el `~` como: ~ X.Y.Z (donde X e Y son fijos);

Entonces, después de leer este artículo como desarrollador usando la biblioteca de otro, puede saber qué tipo de cambios hicieron al presentarle la nueva versión siguiendo las reglas descritas anteriormente:
- Nueva versión 0.2.3 → Los cambios pueden ser solo correcciones de errores;
- Nueva versión 0.5.0 → Algunas funcionalidades agregadas pero compatibles con la API;
- Nueva versión 5.0.0 → Puede haber un problema porque introdujo cambios importantes en la API;

Como conclusión, el beneficio de usar SemVer contra no:
- Compatibilidad / dependencias más claras;
- Fomenta API bien definidas;
- Hace que las decisiones de actualización sean más claras;
