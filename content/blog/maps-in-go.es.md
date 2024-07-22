+++
title = "Maps en Go"
date = "2024-07-22"
author = "charly3pins"
description = "Gestión Eficiente de Datos Clave-Valor."

tags = ["go"]

image = "/images/gopher-zorro.svg"
+++

## Intro

Go incorpora un tipo nativo que implementa las tablas hash llamado map. Es un tipo de dato formado por una colección de llaves únicas y una colección de valores por cada una de esas llaves.
Se lo puede equiparar a un diccionario en otros lenguajes por ejemplo, el cual almacena pares clave-valor. A dichos valores, se les accede mediante las llaves, de igual forma que los arrays y slices como vimos en el anterior post.
Los índices no están limitados a un número como en arrays o slices y los elementos no están ordenados, por lo que si printamos un map nos devolverá un orden aleatorio, si no hacemos nada para sobrescibir su impresión y forzar el orden deseado.

## Declaración e inicialización de mapas

Para declarar un map se hace con `map[key]value`, donde key será el tipo que queramos que sea nuestra llave (debe ser de un tipo comparable https://go.dev/ref/spec#Comparison_operators) y value será el tipo que queremos que se almacene el mapa en cada una de las llaves, sea el tipo que sea, desde un int hasta un struct, u otro map, lo que queramos.

Al igual que con los slices, los map son tipos referenciados, lo que significa que el zero value de un map será nil.
Esto ocurre porqué debajo suyo hay una tabla hash la cual guarda las llaves y valores, y ellos son simplemente una envoltura, abstracción, de las mismas.

Si lo declaramos como:

```go
var m map[int]int
```

su valor será nil.

Si queremos que tenga un zero value, podemos hacer uso de la declaración:

```go
m := map[int]int{}
```

E incluso lo podemos inicializar al igual que los slices, usando la función `make`.

```go
m := make(map[string]string)
```

Haciendo esto, se va a inicializar un mapa hash con la reserva de memoria adecuada para él devolviendo así un mapa que apunta a esa estructura de datos.

## Añadiendo y leyendo valores de un mapa

Para añadir valores a un mapa se hace mediante el uso de llaves `[]` y la llave que toque, al igual que con los arrays o slices. En este ejemplo crearmos un mapa que las llaves sean string y los valores enteros, para guardar nombres y edades.

```go
ages := make(map[string]int)

ages["John"] = 33
ages["Charly"] = 27
ages["Jenny"] = 45
ages["Lisa"] = 19
```

Si queremos añadirle los valores cuando declaramos el map, podemos usar la declaración corta y hacerlo todo en el mismo paso:

```go
ages := map[string]int{"John": 33, "Charly": 27, "Jenny": 45, "Lisa": 19}
```

Para leer los valores, simplemente tenemos que indicar la llave a nuestro mapa y nos devolverá ese valor. Por ejemplo para saber la edad de Lisa, podemos hacer:

```go
fmt.Println(ages["Lisa"]) // 19
```

Si intentamos acceder a una llave que no existe, el valor obtenido será el zero value del tipo, en este caso sería "", ya que es un string.

Para poder comprobar si un elemento existe en el mapa, podemos hacer la comprobación de si el tipo es el por defecto, pero no es muy fiable, ya que quizá existe pero su valor es string vacío o 0 en el caso de int, que concidirían con su zero value, por lo que Go nos ayuda con lo siguiente:

```go
val, ok := ages["Randy"]
```

Si igualamos el map a dos valores, el primero será el valor de ese elemento accedido mediante la llave, en este caso "Randy" la cual no existe, y el segundo un booleano, que indicará si existe o no el mismo.

Si no nos interesa el valor y simplemente queremos comprobar la existencia de una llave, podemos utilizar `_` para omitir el valor de la siguiente forma:

```go
_, ok := ages["Randy"]
```

Al igual que con los arrays y slices, podemos utilizar la funcion `len` para saber cuántos elementos hay en el map.

```go
fmt.Println(len(ages)) // 4
```

Si queremos modificar un valor, es tan simple como acceder a dicho valor mediante llave e igualarlo con otro, y se modificará el mismo.

Si declaramos un segundo map apuntando al primero, si modificamos el valor del segundo, al ser un tipo referenciado, estaremos modificando el valor del primero, porqué ambos comparten la misma tabla hash por debajo.

```go
ages := map[string]int{"John": 33, "Charly": 27, "Jenny": 45, "Lisa": 19}
agesNew := ages
agesNew["Bryan"] = 77
fmt.Println(agesNew) // map[Bryan:77 Charly:27 Jenny:45 John:33 Lisa:19]
fmt.Println(ages) // map[Bryan:77 Charly:27 Jenny:45 John:33 Lisa:19]
```

## Eliminando valores de un mapa

Para eliminar elementos de un map, Go nos prové de una función delete con la siguiente firma `delete(m map[Type]Type1, key Type)` la cual recibe un map y la llave que se quiere eliminar.
En el caso anterior si quisieramos eliminar "Lisa" lo haríamos:

```go
delete(ages, "Lisa")
```

## Recorrer mapas

Si queremos recorrer el contenido de un map, lo podemos hacer usando un `for` con la variación de `range` que ya vimos en el post de arrays y slices.
Como entonces, el primer elemento será el índice, por lo tanto la llave, y el segundo el valor.

```go
for key, value := range ages {
    fmt.Printf("%s: %d\n", key, value)
}

// Output:
// Jenny: 45
// Lisa: 19
// John: 33
// Charly: 27
```

Al igual que con los arrays y slices, si solamente nos interesa el valor, sin la llave, podemos omitirla con el uso de `_`.

```go
for _, value := range ages {
    fmt.Println(value)
}

// Output:
// 19
// 33
// 27
// 45
```

Y si lo que nos interesa es simplemente la llave, podemos asignar el range a una única variable para obtenerla:

```go
for key := range ages {
    fmt.Println(key)
}

// Output:
// John
// Charly
// Jenny
// Lisa
```

## Ordenar un mapa

Como mencionaba en la introducción, en un map la información no está ordenada, por lo que al recorrerlo en un bucle no podemos especificar qué orden sigue ni Go puede garantizar que el orden entre ejecuciones sea el mismo.
Como vimos con los arrays y slices, en la standard library hay un paquete `sort` el cual nos ayuda a ordenar elementos: https://pkg.go.dev/sort

Siguiendo nuestro ejemplo con `ages` y haciendo uso de `sort`, podemos ordenar las llaves del mapa antes de recorrerlo y así garantizar que se accederá en orden.

```go
ages := map[string]int{"John": 33, "Charly": 27, "Jenny": 45, "Lisa": 19}
keys := make([]string, 0, len(ages))
for k := range ages {
    keys = append(keys, k)
}
sort.Strings(keys)
for _, k := range keys {
    fmt.Println(k, ages[k])
}

// Output:
// Charly 27
// Jenny 45
// John 33
// Lisa 19
```

Declaramos nuestro mapa de `ages` con la declaración corta como vimos antes.
Creamos un slices de string para almacenar las llaves y utilizamos el método make con 0 longitud, ya que no tenemos ninguna llave de momento, pero si reservamos la capacidad que tendrá usando el método `len` para la longitud de nuestro mapa.
Recorremos el mapa de `ages` para quedarnos con sus llaves y las añadimos al slice creado.
Ordenamos con la funcion `sort.Strings` las llaves alfabéticamente.
Recorremos el slice de llaves, ya ordenado, y accedemos al mapa con la llave en cuestión.
Así accederemos al mapa de forma ordenada y podemos hacer la lógica que necesite nuestro programa.

## Problemas con la Concurrencia

Algo a tener en cuenta con los maps es que no son seguros para usarlos de forma concurrente. Si se trata de lecturas concurrentes, ya sea accediendo a un valor o a través de un for con un range, no hay problema de que múltiples goroutines accedan a la vez.
El caso problemático es cuando se quiere actualizar el valor de un mapa de forma concurrente, ya sea añadiendo o eliminando elementos del mismo, y a su vez se está leyendo por otro lado, por ejemplo.
Para solventar esta situación hay varias posibles soluciones, que no entraré en mucho detalle, simplemente mencionaré y dejo a vuestra elección el profundizar en ellas.

Si hacemos uso del paquete `sync`: https://pkg.go.dev/sync de la standard library, podremos controlar la syncronía entre las distintas goroutines.
Un posible uso es el del tipo `RWMutex` el cual nos permite bloquear y desbloquear, las lecturas y escrituras a un tipo. Por lo que si tenemos un tipo, que contenga un `sync.RWMutex`y un `map` podremos controlar cuando se puede acceder a él.
Otro tipo interesante a investigar dentro del mismo paquete `sync`, es el de `Map`, el cual nos ofrece ya una serie de funciones que nos van a ayudar a trabajar con nuestro mapa, que al fin y al cabo no podremos trabajar de forma nativa, como sí con la anterior solución.
Dependiendo del caso de uso que estemos implementando, nos será más útil uno u otro, y no hay uno mejor que otro, siempre dependerá de lo que necesitemos.

Espero que haya quedado claro todo lo que he intentado explicar en este post, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantado de responderte.
