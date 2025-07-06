+++
title = "Consejos y trucos para programar en Go de forma limpia, funcional y efectiva"
date = "2024-04-17"
author = "charly3pins"
description = "Aprende a programar de manera efectiva siguiendo las mejores prácticas del lenguaje, desde lo básico hasta lo avanzado, con ejemplos prácticos para que puedas escribir código limpio y funcional en Go."

tags = ["go"]

image = "/images/gopher-bulb.png"
+++

## Nombres de variables

Go gestiona la visibilidad con minúsculas para "no exportados" y mayúsculas para "exportados". Estos conceptos son válidos en el contexto de un paquete, por lo que si declaras una variable en un `paquete X` con el siguiente código:

```go
package X

var foo int // unexported
var Bar int // exported
```

Podrás llamar a las variables `foo` y `Bar` mientras estés dentro de ese paquete, pero si estás en otro paquete, solo tendrás acceso a la variable Bar.

## Nombres de paquetes

Con respecto a los nombres de los paquetes, no se recomienda usar el guión bajo `_` en el nombre, y generalmente una sola palabra, aunque es solo una recomendación, así que sígalas si tiene sentido para usted.
Además, los nombres de los paquetes se utilizan para hacer referencia a las variables, constantes y tipos de un paquete, teniendo así:

```go
package player

type Player struct {}
```

y llamarlo desde nuestro paquete principal, se verá así:

```go
package main

import "player"

myPlayer := player.Player{}
```

Entonces vemos que hay demasiada información detallada sobre el jugador, por lo que tal vez sea mejor repensar el nombre del paquete o el nombre de la estructura.

## No utilices Getters

Si tenemos un tipo como:

```go
type Player struct {
    Name string
    Dorsal int
}
```

no crees getters para cada campo:

```go
func (p Player) GetName() string {
    return p.Name
}

func (p Player) GetDorsal() int {
    return p.Dorsal
}
```

Accede directamente a cada campo como `Player.Name` o `Player.Dorsal` o si necesitas una función hazlo sin el prefijo `Get`.

## Interfaces

La convención para las interfaces dice que deben ser un método único y nombrarse con el nombre del método + sufijo `-er` o similar.

Por ejemplo, si queremos crear una interfaz para nuestros defensores o delanteros en nuestro Equipo, siguiendo la convención lo haríamos así:

```go

type Defender interface {
    Defend() error
}

type Striker interface {
    Strike() error
}
```

## Composición de interfaces

Cuando tiene una interfaz de método único como las anteriores, puede crear otra interfaz, componiéndola con esas interfaces. Entonces nuestra interfaz de jugador será:

```go
type Player interface {
    Defender
    Striker
}
```

## CamelCase vs snake_case

En Go Camel Case es el más utilizado. Es extraño encontrar un snake case en cualquier nombre de variable o constante. En los paquetes ya mencioné que no es recomendable pero a veces es necesario hacerlo.

## Constantes

Las constantes son como variables, pero con valor constante. No deben declararse todos en mayúsculas como se hace en otros idiomas. La única mayúscula que debes agregar es la primera letra si deseas exportarla (como variables) o no.

```go
const Minutes = 90
const minutes = 90
const MINUTES = 90 // not recommended
```

## Agrupación de variables y constantes

Si declaras más de una variable o más de una constante, puedes hacerlo como lo hicimos nosotros aquí, o puedes agruparlas para mejorar la legibilidad de tu código:

```go
const (
    parts = 2
    players = 22
)

var (
    fizz = "fizz"
    buzz = "buzz"
)
```

Esto es muy útil cuando estás escribiendo una nueva función y al principio declaras las variables agrupadas como:

```go
func fn() error {
    var (
        x int
        y byte
        z string
    )
    // Logic here
    return nil
}
```

## Enums

En Go, el concepto de "enums" no existe, pero se pueden replicar usando constantes y un tipo "iota", que es un enumerador de números enteros. Para hacerlo, puedes definir tu enumeración como:

```go
type Position int

const (
    Goalkeeper Position = iota
    Defender
    Mid
    Striker
)
```

Con eso, puedes trabajar con las constantes como de costumbre, y serán de tipo Posición, en lugar de iota (int).
Declararlo así es suficiente la mayoría de las veces, pero introduce un posible error en su código. El valor cero de iota es 0, igual que el int, y sabemos que Go tiene valores cero por defecto.
Entonces, si define una nueva posición pero no la inicializa con ninguna de las constantes, dado que la posición predeterminada es Portero, su nueva posición predeterminada será Portero, y tal vez no sea el comportamiento que desea que tenga la aplicación.

Puedes resolver eso de 2 maneras. La primera es simplemente sumando +1 al valor inicial, por lo que el valor 0 no será ninguno de los que definiste.

```go
type Position int

const (
    Goalkeeper Position = iota + 1
    Defender
    Mid
    Striker
)
```

Está bien, pero aún existe el problema de ¿qué posición tiene el valor 0? Para resolver esto, la solución común es definir el valor cero como Desconocido o Predeterminado o un valor similar como:

```go
type Position int

const (
    Unknown Position = iota
    Goalkeeper
    Defender
    Mid
    Striker
)
```

Con estos 2 trucos ya estás listo para trabajar con tu enumeración de Posición. ¿Qué pasa si quieres imprimirlos? Son int, por lo que verás solo números... tal vez eso no sea algo que te importe, pero si te importa, aquí tienes un truco que puedes hacer para trabajar con cadenas.
Go tiene la interfaz Stringer() con su método `String() string` que puedes satisfacer con cualquier tipo que desees. Aprovechando eso podemos hacer:

```go
func (p Position) String() string {
    switch p{
    case Goalkeeper:
        return "Goalkeeper"
    case Defender:
        return "Defender"
    case Mid:
        return "Mid"
    case Striker:
        return "Striker"
    }
    return "Unknown"
}
```

## Constructores

A veces, el valor cero de un tipo no es suficiente y desea inicializar su tipo. Para eso necesitas usar constructores.

```go
package player

type Player struct {
    Name string
    Dorsal int
}

func NewPlayer(name string, dorsal int) *Player {
    return &Player{
        Name: name,
        Dorsal: dorsal,
    }
}
```

Con la función `NewPlayer` inicializamos los valores del Player con la información proporcionada como argumento en lugar de los valores cero que serían "" y 0.
Siguiendo la recomendación de nomenclatura que describimos antes, podemos refactorizar esto en algo más idiomático, porque ahora llamar a ese constructor desde main se vería así:

```go
package main

import "player"

myPlayer := player.NewPlayer("gopher", 666)
```

Mejor si hacemos una pequeña refactorización como:

```go
package player

type Player struct {
    Name string
    Dorsal int
}

func New(name string, dorsal int) *Player {
    return &Player{
        Name: name,
        Dorsal: dorsal,
    }
}
```

por lo que en nuestro main la legibilidad mejorará:

```go
package main

import "player"

myPlayer := player.New("gopher", 666)
```

## Múltiples valores de retorno

En Go, cualquier función o método puede devolver múltiples valores, de 0 a N. El "error" generalmente se devuelve como el último valor.

```go
// 2 values return
func (Player) Shoot() (int, error) {
    return 99, nil
}
// single value return
func (Player) Refill() error {
    // do logic
    return
}
// no return value
func (p *Player) Substitute(name string) {
    p.Name = name
}
```

## Evitar el uso de panic

La mayoría de las veces basta con devolver errores, pero ¿qué pasa si el error es irrecuperable y el programa no puede continuar? Para ese caso existe el `pánico`.

La recomendación es no utilizar pánicos, pero si es necesario, la convención dice que se llame a la función con el prefijo "Must". Veamos un ejemplo:

```go
// without panic
func ParseFiles() error {
    // do logic
    if err != nil {
        // handle error
        return err
    }
}

//with panic
func MustParseFiles() {
    // do logic
    if err != nil {
        // handle error
        panic()
    }
}
```

Espero que haya quedado claro todo lo que he intentado explicar en este post, y por favor si hay alguna parte que no ha quedado del todo clara o hay partes que no he cubierto que te gustaría que hiciera déjame un comentario aquí mismo o a través de mis redes sociales que tienes en mi perfil y estaré encantado de responderte.
