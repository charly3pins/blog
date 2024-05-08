+++
title = "Tips and tricks to code in Go in a clean, functional and effective way"
date = "2024-04-17"
author = "charly3pins"
description = "Learn how to code effectively by following the best practices of the language, from basics to advanced, with practical examples so you can write clean and functional code in Go."

tags = ["go"]

image = "/images/gopher-bulb.png"
+++

{{< youtube 4wZmL3XpR04 >}}

## Variable names

Go manages the visibility with lowercase for `unexported` and uppercase for `exported`. These concepts are valid in the context of a package, so if you declare a variable in a `package X` with the following code:

```go
package X

var foo int // unexported
var Bar int // exported
```

You will be able to call the variable `foo` and `Bar` while you're inside that package, but if you are in another package, you will have access only to the Bar variable.

## Package names

Regarding the package names is not recomended to use the underscore `_` in the naming, and usually a single word, altuhough it's just a recomendation, so follow them if makes sense for you.
Also the packages names are used to reference the variables, constants, and types of a package, so having:

```go
package player

type Player struct {}
```

and calling it from our main package, will look like:

```go
package main

import "player"

myPlayer := player.Player{}
```

So we see that there is too many player verbosity, so maybe better to rethink the name of the package, or the name of the struct.

## Don't use Getters

If we have a type like:

```go
type Player struct {
    Name string
    Dorsal int
}
```

don't create getters for each field:

```go
func (p Player) GetName() string {
    return p.Name
}

func (p Player) GetDorsal() int {
    return p.Dorsal
}
```

Access directly to each field like `Player.Name` or `Player.Dorsal` or if you need a function do it without the `Get` prefix.

## Interfaces

The convention for the interfaces says that they should be a single method and named with the method name + `-er` suffix or similar.

For example, if we want to create an interface for our defenders or strikers in our Team, following the convention we would do it like:

```go

type Defender interface {
    Defend() error
}

type Striker interface {
    Strike() error
}
```

## Inteface composition

When you have single-methods interface like the ones above, you can create another interface, composing it by those interfaces. So our Player interface will be:

```go
type Player interface {
    Defender
    Striker
}
```

## CamelCase vs snake_case

In Go Camel Case it's the one most used. It's strange to find snake case in any variable or constant name. In packages I already mentioned that is not recommended but sometimes you need to do it.

## Constants

Constnats are like variables, but with constant value. They should not be declared all in upper case like you do in other languages. The unique upper case you should add is the first letter if you want to export it (like variables) or not.

```go
const Minutes = 90
const minutes = 90
const MINUTES = 90 // not recommended
```

## Grouping variables and constants

If you are declaring more than one variable or more than one constant, you can do it as we did here, or you can group them to improve the readability of your code:

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

This is super useful when you're writing a new function and at the begining you declare the variables grouped like:

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

In Go the concept of `enums` doesn't exist but they can be replicated using constants and a type `iota` which is an integer enumerator. To do it, you can define your enum as:

```go
type Position int

const (
    Goalkeeper Position = iota
    Defender
    Mid
    Striker
)
```

With that, you can work with the constants as usual, and they will be of type Position, instead of iota (int).
Declaring it like this is enough most of the times but it introduces a possible bug in your code. The zero-value of the iota is 0, same as the int, and we know that Go has zero-values by default.
So if you define a new position but you don't initialize it with any of the constants, Since the default position is Goalkeeper, your new default position will be Goalkeeper, and perhaps it is not the behavior you want the application to have.

You can solve that in 2 ways. First one is by simply adding +1 to the initial value, so the 0 value will not be any of the ones you defined.

```go
type Position int

const (
    Goalkeeper Position = iota + 1
    Defender
    Mid
    Striker
)
```

That's OK, but it still has the problem of, which Position is the value 0? To solve this, the common solution is define the zero value as an Unknown or Default or similar value like:

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

With these 2 tricks you are now ready to work with your Position enum. What if you want to print those? They are int, so you will see just numbers... maybe that's not something you care, but if you do, here is a trick that you can do to work with strings.
Go has the Stringer() interface with its method `String() string` that you can satisfy with any type you want. Taking advantage of that we can do:

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

## Constructors

Sometimes the zero value of a type isn't enough and you want to initialize your type. For that you need to use constructors.

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

With the `NewPlayer` function we initialize the Player values with the information provided as argument instead of the zero values that would be "" and 0.
Following the naming recommendation that we described before, we can refactor this into something more idiomatic, because now to call that constructor from main would look like:

```go
package main

import "player"

myPlayer := player.NewPlayer("gopher", 666)
```

Better if we do a small refactor like:

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

so in our main the readability will be improved as:

```go
package main

import "player"

myPlayer := player.New("gopher", 666)
```

## Multiple return values

In Go, any function or method can return multiple values, from 0 to N. The `error` usually is returned as the latest value.

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

## Don't use panic

Most of the times simply returning errors is enough, but what if the error is unrecoverable and the program cannot continue? For that case exists the `panic`.

The recommendation is to not use panics, but if you need to, the convention says to call the function with the prefix `Must`. Let's see an example:

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

## Order declaring functions for a specific type

When you have a new type, as we saw before, most of the times you're going to create a function that acts as a constructor, and probably a list of methods for that type, maybe exported, maybe unexported.

What's the best order to declare each function? Let's see what the convention says.

```go
// first, declare the type
type Shape strut {
    x int
    y int
    color int
}

// next, the constructor
func NewShape(x, y, c int) *Shape {
    return &Shape{
        x: x,
        y: y,
        color: c,
    }
}

// next, the exported methods
func (s *Shape) Paint(c int) {
    s.color = c
}

// last, the unexported methods
func (s *Shape) reset() {
    s.x = 0
    s.y = 0
    s.color = 0
}
```

I hope everything that I have tried to explain in this post has been clear, and please if there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
