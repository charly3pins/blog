+++
title = "Maps in Go"
date = "2024-07-22"
author = "charly3pins"
description = "Efficient Key-Value Data Management."

tags = ["go"]

image = "/images/gopher-zorro.svg"
+++

## Intro

Go incorporates a native type that implements hash tables called map. It is a data type made up of a collection of unique keys and a collection of values for each of those keys.
It can be compared to a dictionary in other languages, for example, which stores key-value pairs. These values are accessed using keys, in the same way as arrays and slices as we saw in the previous post.
The indexes are not limited to a number as in arrays or slices and the elements are not ordered, so if we print a map it will return a random order, if we do nothing to override its printing and force the desired order.

## Map declaration and initialization

To declare a map it is done with `map[key]value`, where key will be the type we want our key to be (it must be of a comparable type https://go.dev/ref/spec#Comparison_operators) and value will be the type that we want the map to be stored in each of the keys, whatever type it is, from an int to a struct, or another map, whatever we want.

As with slices, maps are referenced types, which means that the zero value of a map will be nil.
This happens because underneath it there is a hash table which stores the keys and values, and they are simply an envelope, abstraction, of them.

If we declare it as:

```go
var m map[int]int
```

its value will be nil.

If we want it to have a zero value, we can use the declaration:

```go
m := map[int]int{}
```

And we can even initialize it just like the slices, using the `make` function.

```go
m := make(map[string]string)
```

Doing this will initialize a hash map with the appropriate memory pool for it, thus returning a map that points to that data structure.

## Adding and reading values from a map

Adding values to a map is done by using curly braces `[]` and the curly brace, just like with arrays or slices. In this example we will create a map with the keys being strings and the values being integers, to store names and ages.

```go
ages := make(map[string]int)

ages["John"] = 33
ages["Charly"] = 27
ages["Jenny"] = 45
ages["Lisa"] = 19
```

If we want to add the values to it when we declare the map, we can use the short declaration and do it all in the same step:

```go
ages := map[string]int{"John": 33, "Charly": 27, "Jenny": 45, "Lisa": 19}
```

To read the values, we simply have to indicate the key to our map and it will return that value. For example, to find out Lisa's age, we can do:

```go
fmt.Println(ages["Lisa"]) // 19
```

If we try to access a key that does not exist, the value obtained will be the zero value of the type, in this case it would be "", since it is a string.

In order to check if an element exists in the map, we can check if the type is the default, but it is not very reliable, since perhaps it exists but its value is an empty string or 0 in the case of int, which would match with its zero value, so Go helps us with the following:

```go
val, ok := ages["Randy"]
```

If we equal the map to two values, the first will be the value of that element accessed through the key, in this case "Randy" which does not exist, and the second will be a boolean, which will indicate whether it exists or not.

If we are not interested in the value and simply want to check for the existence of a key, we can use `_` to ignore the value as follows:

```go
_, ok := ages["Randy"]
```

As with arrays and slices, we can use the `len` function to find out how many elements there are in the map.

```go
fmt.Println(len(ages)) // 4
```

If we want to modify a value, it is as simple as accessing said value using a key and matching it with another, and it will be modified.

If we declare a second map pointing to the first, if we modify the value of the second, since it is a referenced type, we will be modifying the value of the first, because both share the same hash table underneath.

```go
ages := map[string]int{"John": 33, "Charly": 27, "Jenny": 45, "Lisa": 19}
agesNew := ages
agesNew["Bryan"] = 77
fmt.Println(agesNew) // map[Bryan:77 Charly:27 Jenny:45 John:33 Lisa:19]
fmt.Println(ages) // map[Bryan:77 Charly:27 Jenny:45 John:33 Lisa:19]
```

## Removing values from a map

To delete elements from a map, Go provides us with a delete function with the following signature `delete(m map[Type]Type1, key Type)` which receives a map and the key to be deleted.
In the previous case, if we wanted to eliminate "Lisa" we would do it:

```go
delete(ages, "Lisa")
```

## Looping through maps

If we want to go through the content of a map, we can do it using a `for` with the variation of `range` that we already saw in the post on arrays and slices.
As then, the first element will be the index, therefore the key, and the second the value.

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

As with arrays and slices, if we are only interested in the value, without the key, we can omit it by using `_`.

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

And if what interests us is simply the key, we can assign the range to a single variable to obtain it:

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

## Sort a map

As I mentioned in the introduction, in a map the information is not ordered, so when looping through it we cannot specify what order it follows, nor can Go guarantee that the order between executions is the same.
As we saw with arrays and slices, in the standard library there is a `sort` package which helps us sort elements: https://pkg.go.dev/sort

Following our example with `ages` and using `sort`, we can sort the keys of the map before traversing it and thus guarantee that it will be accessed in order.

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

We declare our `ages` map with the short declaration as we saw before.
We create a string slices to store the keys and use the make method with 0 length, since we do not have any keys at the moment, but we do reserve the capacity it will have using the `len` method for the length of our map.
We go through the `ages` map to keep its keys and add them to the created slice.
We sort the keys alphabetically with the `sort.Strings` function.
We go through the slice of keys, already ordered, and access the map with the key in question.
This way we will access the map in an orderly manner and we can do the logic that our program needs.

## Problems with Concurrency

Something to keep in mind with maps is that they are not safe to use concurrently. If these are concurrent reads, either accessing a value or through a for with a range, there is no problem with multiple goroutines accessing it at the same time.
The problematic case is when you want to update the value of a map concurrently, either by adding or removing elements from it, and at the same time you are reading it from another side, for example.
To solve this situation there are several possible solutions, which I will not go into much detail, I will simply mention and leave it to your choice to delve deeper into them.

If we use the `sync` package: https://pkg.go.dev/sync from the standard library, we can control the synchrony between the different goroutines.
A possible use is the `RWMutex` type which allows us to lock and unlock reads and writes to a type. So if we have a type that contains a `sync.RWMutex` and a `map` we can control when it can be accessed.
Another interesting type to investigate within the same `sync` package is `Map`, which already offers us a series of functions that will help us work with our map, which in the end we will not be able to work with natively, as with the previous solution.
Depending on the use case we are implementing, one or the other will be more useful to us, and there is no one better than the other, it will always depend on what we need.

I hope everything that I have tried to explain in this post has been clear, and please if there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
