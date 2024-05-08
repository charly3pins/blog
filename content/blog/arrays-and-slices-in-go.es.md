+++
title = "Arrays y slices en Go"
date = "2024-05-09"
author = "charly3pins"
description = "Entiende los detalles de los Slices, el tipo de datos más usado en Go."

tags = ["go"]

image = "/images/gopher-nerdy.png"
+++

## Intro

Cuando queremos agrupar una serie de elementos del mismo tipo lo podemos hacer en Go de dos formas, usando arrays o slices.
Los array, tienen la particularidad de que su tamaño es fijo, y no se puede modificar.
Los slice, en cambio, tienen un tamaño dinámico, por lo que podremos modificarlos según nuestras necesidades.

Veamos un ejemplo de uso de slices con un "juego" y así entender porqué son importantes los arrays si estamos hablando de slices.

Declaramos un slice con 3 números, declaramos otro slice a partir del primer, cogiendo un único elemento, y le agregamos el número 10. Veamos cómo se ve el slice creado y el slice inicial.

```go
a := []int{1, 2, 3}
fmt.Println(a)

b := append(a[:1], 10)
fmt.Println(b)

// print original slice
fmt.Println(a)
/// WTF???
```

## Arrays

Los arrays no son otra cosa más que un tipo de datos para guardar información del mismo tipo, de forma secuencial, accediendo a ésta de forma indexada.
Los arrays son valores, por lo que si asignamos un array a otro, se copiarán todos los elementos de uno a otro. Lo mismo ocurre en funciones, no recibirá un puntero al array, sino una copia del mismo. El tamaño del array forma parte de su tipo, por lo que [2]int es distinto a [10]int.
La representacion en memoria de un array se puede ver cómo en la siguiente imagen, donde se almacena en tantas posiciones como el tipo nos indique y en posiciones contiguas para ese tipo.

// TODO insert image excalidraw

### Usar arrays

Para declarar un array hay varias formas, vamos a ver cómo podemos hacerlo.

```go
var languages [5]string
```

Así tendremos un array con zero value, y como observamos tendremos 5 posiciones con el texto vacío, ya que es el zero value del tipo string que hemos escogido.

Para inicializar los elementos del array podemos hacerlo accediendo a cada posición por su índice e indicando qué valor le damos:

```go
languages[0] = "English"
languages[1] = "Spanish"
languages[2] = "Japanese"
languages[3] = "German"
languages[4] = "French"
```

También podemos usar la declaración corta y hacerlo todo en el mismo paso:

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}
```

Lo mismo sirve para arrays de otros tipos, por ejemplo con enteros.

```go
var nums [10]int
fmt.Println(nums) // [0 0 0 0 0 0 0 0 0 0]
// init values
nums[0] = 7
nums[1] = 444
nums[8] = 38
nums[9] = 60
fmt.Println(nums) // [7 4444 0 0 0 0 38 60]
```

Para acceder a los elementos, usamos las llaves `[` y `]` indicando el índice de la posición a la que queremos asignar el valor.

Hay dos funciones que vienen en Go que nos sirven para trabajar con arrays.
`len()` para conocer su longitud y `cap()` para conocer su capacidad.

Si las utilizamos con el ejemplo anterior veremos que en ambos casos nos devuelve 10.

```go
fmt.Println(len(numeros)) // 10
fmt.Println(cap(numeros)) // 10
```

En el caso de arrays la capacidad no se usa porque es igual a la longitud, por lo que con len() nos es suficiente. Su uso más recurrente es en los bucles para indicarle que debe incrementar el índice hasta el máximo-1 (el primer índice es 0) e ir accediendo a los distintos elemenos. Lo veremos más adelante.

### Arrays multidimensionales

Los array pueden tener más de una dimension. Para ello hay que añadirle nuevamente las llaves `[` y `]` y el número de elementos de esa dimensión.

Podemos declarar un array multidimensional para almacenar animales y sus sonidos de la siguiente forma:

```go
animalSounds := [5][2]string{
	{"lion", "roar"},
	{"dog", "barks"},
    {"cat", "meows"},
	{"frog", "croaks"},
    {"elephant", "trumpets"},
}
```

De esta forma le hemos indicado al compilador que nuestro array va a tener 5 elementos, con 2 elementos cada uno, es decir una matriz de 10 elementos, de tipo string.

### Recorrer arays

Hemos visto que para acceder a los array podemos usar las llaves `[]` por lo que si hacemos un bucle que vaya incrementando el valor del índice nos irá devolviendo los valores del mismo.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for i:=0;i<len(languages);i++ {
    fmt.Println(languages[i])
}
```

Esto está muy bien, pero Go nos ofrece una función específica que nos simplifica esto, el range. Con range, en otros lenguajes conocido como foreach, automaticamente se recorre el array sin tener que preocuparse de incrementar el índice de la siguiente forma.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for index, value := range languages {
    fmt.Println(index)
    fmt.Println(value)
}
```

Como vemos, es mucho más simple que no trabajar con índices si no tenemos ningún requerimiento extra a nivel de acceso a éste.

Si solo nos interesa el valor, y no el índice, podemos omitirlo usando el operador `_`.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for _, value := range languages {
    fmt.Println(value)
}
```

Por contrario, si solo nos interesa el índice, podemos igualar el range a una única variable, y ésta será el índice.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for index := range languages {
    fmt.Println(index)
}
```

### Buscar en arrays

Si lo que queremos es saber si hay un elemento en un array, es decir, hacer una búsqueda para encontrarlo, podemos hacer uso de los bucles tal como hemos visto anteriormente y comprobar cada valor si es el buscado, para devolverlo o hacer lo que necesitemos.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}
pattern := "Japanese"
for _, value := range languages {
    if value == pattern {
        // DO LOGIC
        break
    }
}
```

En este ejemplo hemos introducido la palabra `break` la cual hace romper el bucle y salir de él. Parece razonable en el ejemplo que si encontramos el idioma que buscamos, salgamos del array, pero quizá no es lo que quieras, por lo que no es obligatorio usarlo.

### Añadir o eliminar elementos en arrays

Cómo hemos visto antes, un array tiene un tipo fijo el cuál indica una longitud que no se puede moficiar. Si queremos añadir o eliminar elementos solamente podremos hacerlo creando otro array con la longitud deseada, ya sea mayor o menor que el original.

Esto provoca que sea un tipo de datos poco flexible y molesto en ocasiones para trabajar con él. Por suerte los genios de Go pensaron en todo y crearon otro tipo que solventa muchos de estos problemas, los Slice.

## Slices

Los slices pueden definirse como arrays de longitud dinámica. En realidad lo que ocurre es que los slice son una abstracción creada encima de los arrays ofreciendonos un mayor control y flexibilidad para trabajar con estos.

Lo que ocurre por debajo es que cada vez que definimos un slice, se crea un array por debajo que no vemos, y el slice apunta a él mediante un puntero.
Por esta razón, el zero value del slice, no será N elementos con zero value, siendo N la longitud, como ocurría con los arrays, sino que será nil, ya que no habrá array por debajo al cual apuntar, por lo que no tendremos puntero inicializado.

// TODO insert excalidraw image

### Usar slices

Para declarar un slice se hace de la misma forma que hemos visto anteriormente con los arrays, con la única diferencia de que no especificamos la longitud.

```go
animals := []string{"dog", "cat", "bird", "horse"}
```

Como dije antes, si no le pasamos valores, el zero value no será strings vacíos, ya que al no tener una longitud, cuántos debería tener? Por lo que el zero value será nil.

Para crear slices también existe la función `make` la cual tiene la siguiente firma:

```go
func make([]T, len, cap) []T
```

T es el tipo de elementos que queremos en el slice, len es la longitud, y cap es la capacidad, que es opcional. Si no se le pasa una capacidad, por defecto se coge como valor el de la longitud.

Otra forma de crear un slice es "cortándolo". Para ello se utiliza un rango medio abierto con dos índices separados por dos puntos.
En el ejemplo de los animales anterior, si hicieramos `animals[1:3]`, crearía un slice incluyendo los elementos del 1 al 3 de animals, por lo que "horse" no se incluiría en se nuevo slice.

El inicio y final en los índices de un slice son opcionales por lo que podemos llamarlo de estas 3 formas:

```go
fmt.Println(animals[:2]) // [dog cat]
fmt.Println(animals[3:]) // [horse]
fmt.Println(animals[:])  // [dog cat bird horse]
```

Para crear un slice a partir de un array podemos usar la última forma `[:]`:

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}
sLanaguages := languages[:]
```

Lo que hay que tener en cuenta usando este método es que no se realiza una copia del array por debajo del slice, simplemente se limita el acceso a él según el rango del nuevo slice.
Esto significa que si tenemos un slice con 1000 elementos, y hacemos uno nuevo con un rango de 10 elementos [:10], lo que ocurrirá es que en el nuevo slice solo tendremos 10 elementos, pero el array por debajo seguirá teniendo los 1000.
Ocasionalmente, esto puede hacer que el programa mantenga todos los datos en la memoria cuando solo se necesita una pequeña parte.

### Añadir elementos a un slice

Como vimos antes, un array no puede modificar su longitud ya que es parte de su tipo, pero no ocurre lo mismo con los slice. Para ello tenemos que crear un nuevo slice que sea más largo y copiar los elementos del slice original hacia el nuevo.
Para ello Go nos proveé de una funcion llamada `copy(dst, src []T) int` la cual nos facilita esta tarea:

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}
newLanguages := make([]string, len(languages))
copy(newLanguages, languages)
```

En ocasiones lo que necesitaremos será añadir elementos al slice de una forma más o menos dinámica dependiendo del caso, más allá de crear una copia entera del slice manteniendo los dos slices a la vez.
Go nos ayuda de nuevo con su función `append(s []T, x ...T) []T`, la cual añade el elemento x al final del slice, la cual hará crecer la capacidad del slice si es necesario. Cada vez que esto ocurre, el array por debajo del slice dobla su longitud, por lo que es algo a tener en cuento si nos toca hacer trabajos de optimización.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}
languages = append(languages, "Chinese")
```

Además de esto, también podemos añadir un slice a otro con `...` de la siguiente forma:

```go
myNums := []int{1, 2, 3}
yourNums := []int{4, 5, 6}
myNums = append(myNums, yourNums...) // equivalent to append(myNums, yourNums[0], yourNums[1], yourNums[2])
fmt.Println(myNums) // [1 2 3 4 5 6]
```

### Slices multidimensionales

Igual que con los arrays, podemos declarar slices multidimensionales añadiendo más dimensiones simplemente añadiendo `[]` como `[][]int`.

```go
animalSounds := [][]string{
	{"lion", "roar"},
	{"dog", "barks"},
    {"cat", "meows"},
	{"frog", "croaks"},
    {"elephant", "trumpets"},
}
```

### Recorrer slices

Al igual que con los arrays, podemos recorrer los slices usando los distintos tipos de bucles.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for i:=0;i<len(languages);i++ {
    fmt.Println(languages[i])
}
```

También podemos usar range para recorrer los slice.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for index, value := range languages {
    fmt.Println(index)
    fmt.Println(value)
}
```

Si solo nos interesa el valor, y no el índice, podemos omitirlo usando el operador `_`.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for _, value := range languages {
    fmt.Println(value)
}
```

Por contrario, si solo nos interesa el índice, podemos igualar el range a una única variable, y ésta será el índice.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for index := range languages {
    fmt.Println(index)
}
```

### Eliminar elementos de un slice

A diferencia de los array, con los slice si es posible eliminar elementos de ellos, utilizando el método de slicing (corte) que vimos anteriormente.
Hay que coger el slice que queremos y cortarlo en una parte hasta el índice del elemento a eliminar, y añadirle el mismo slice pero con la parte restante +1, para eliminar el elemento de la posición del índice.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}
indexToRemove := 3
languages = append(languages[:indexToRemove], languages[indexToRemove+1:]...)
```

### Ordenar un slice

Se puede ordenar los elementos de un slice con el paquete `sort` de Go https://pkg.go.dev/sort.

```go
slice := []int{12, 2, 90, 6, 88, 5, 28, 4}
sort.Ints(slice)
fmt.Println(slice) // [2 4 5 6 12 28 88 90]

languages := []string{"English", "Spanish", "Japanese", "German", "French"}
sort.Strings(languages)
fmt.Println(languages) // [English French German Japanese Spanish]
```

Recomiendo revisar el paquete `sort` para entendner todas las opciones que hay.

### Buscar y filtrar elementos

Al igual que con los arrays, para encontrar elementos de un slice debemos reocrrerlos y comporbar los valores de cada posición y detectar si es lo que buscamos.
Además con los slice podemos filtrar esos elementos, creando un nuevo slice sin o con los elementos encontrados, dependiendo de lo que queramos.

```go
ages := []int{11, 16, 23, 38, 45}
adults := []int{}
for _, age := range ages {
    if age > 18 {
        adults = append(adults, age)
    }
}
```

Espero que haya quedado claro todo lo que he intentado explicar en este post, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantado de responderte.
