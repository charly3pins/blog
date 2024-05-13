+++
title = "Arrays and slices in Go"
date = "2024-05-09"
author = "charly3pins"
description = "Understand the details of Slices, the most used data type in Go."

tags = ["go"]

image = "/images/gopher-zorro.svg"
+++

{{< youtube _5bhRHYK8eQ >}}

## Intro

When we want to group a series of elements of the same type we can do it in Go in two ways, using arrays or slices.
Arrays have the particularity that their size is fixed and cannot be modified.
The slices, on the other hand, have a dynamic size, so we can modify them according to our needs.

Let's see an example of using slices with a "game" and thus understand why arrays are important if we are talking about slices.

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

Arrays are nothing more than a type of data to store information of the same type, sequentially, accessing it in an indexed manner.
Arrays are values, so if we assign one array to another, all the elements from one to the other will be copied. The same thing happens in functions, you will not receive a pointer to the array, but a copy of it. The size of the array is part of its type, so [2]int is different from [10]int.
The memory representation of an array can be seen in the following image, where it is stored in as many positions as the type indicates and in adjacent positions for that type.

![go-arrays](/images/go-arrays.jpeg)

### Declaration and initialization of arrays

There are several ways to declare an array, let's see how we can do it.

```go
var languages [5]string
```

Thus we will have an array with zero value, and as we observe we will have 5 positions with empty text, since it is the zero value of the string type that we have chosen.

To initialize the elements of the array we can do so by accessing each position by its index and indicating what value we give it:

```go
languages[0] = "English"
languages[1] = "Spanish"
languages[2] = "Japanese"
languages[3] = "German"
languages[4] = "French"
```

We can also use the short statement and do it all in the same step:

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}
```

The same applies to arrays of other types, for example with integers.

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

To access the elements, we use the braces `[` and `]` indicating the index of the position to which we want to assign the value.

There are two functions that come in Go that help us work with arrays.
`len()` to know its length and `cap()` to know its capacity.

If we use them with the previous example we will see that in both cases it returns 10.

```go
fmt.Println(len(numeros)) // 10
fmt.Println(cap(numeros)) // 10
```

In the case of arrays, the capacity is not used because it is equal to the length, so len() is enough for us. Its most recurrent use is in loops to indicate that it must increase the index to the maximum -1 (the first index is 0) and access the different elements. We will see it later.

### Multidimensional arrays

Arrays can have more than one dimension. To do this, you must add the braces `[` and `]` and the number of elements of that dimension again.

We can declare a multidimensional array to store animals and their sounds in the following way:

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

### Looping through arrays

We have seen that to access the arrays we can use the keys `[]` so if we make a loop that increases the value of the index it will return its values.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for i:=0;i<len(languages);i++ {
    fmt.Println(languages[i])
}
```

This is very good, but Go offers us a specific function that simplifies this for us, the range. With range, known in other languages as foreach, the array is automatically traversed without having to worry about incrementing the index in the following way.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for index, value := range languages {
    fmt.Println(index)
    fmt.Println(value)
}
```

As we see, it is much simpler than not working with indexes if we do not have any extra requirements regarding access to it.

If we are only interested in the value, and not the index, we can omit it using the `_` operator.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for _, value := range languages {
    fmt.Println(value)
}
```

On the other hand, if we are only interested in the index, we can set the range equal to a single variable, and this will be the index.

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}

for index := range languages {
    fmt.Println(index)
}
```

### Search in arrays

If what we want is to know if there is an element in an array, that is, to do a search to find it, we can use the loops as we have seen previously and check each value if it is the one we were looking for, to return it or do whatever we need .

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

In this example we have introduced the word `break` which breaks the loop and exits it. It seems reasonable in the example that if we find the language we are looking for, we leave the array, but perhaps it is not what you want, so it is not mandatory to use it.

### Add or remove elements in arrays

As we have seen before, an array has a fixed type which indicates a length that cannot be changed. If we want to add or remove elements we can only do so by creating another array with the desired length, whether greater or less than the original.

This makes it a data type that is inflexible and sometimes annoying to work with. Luckily the Go geniuses thought of everything and created another type that solves many of these problems, the Slice.

## Slices

Slices can be defined as arrays of dynamic length. In reality, what happens is that slices are an abstraction created on top of arrays, offering us greater control and flexibility to work with them.

What happens below is that every time we define a slice, an array is created below that we do not see, and the slice points to it using a pointer.
For this reason, the zero value of the slice will not be N elements with zero value, with N being the length, as was the case with arrays, but will be nil, since there will be no array below to point to, so we will not have initialized pointer.

![go-slices-nil](/images/go-slices-nil.jpeg)

### Declaration and initialization of slices

To declare a slice it is done in the same way as we have seen previously with arrays, with the only difference that we do not specify the length.

```go
animals := []string{"dog", "cat", "bird", "horse"}
```

As I said before, if we do not pass values, the zero value will not be empty strings, since since it does not have a length, how many should it have? So the zero value will be nil.

To create slices there is also the `make` function which has the following signature:

```go
func make([]T, len, cap) []T
```

T is the type of elements we want in the slice, len is the length, and cap is the capacity, which is optional. If a capacity is not passed, by default the length is taken as the value.

![go-slices-not-nil](/images/go-slices-not-nil.jpeg)

Another way to create a slice is to "cut" it. To do this, an open midrange is used with two indices separated by two points.
In the animals example above, if we were to do `animals[1:3]`, it would create a slice including elements 1 through 3 of animals, so "horse" would not be included in the new slice.

The start and end in the indexes of a slice are optional so we can call it in these 3 ways:

```go
fmt.Println(animals[:2]) // [dog cat]
fmt.Println(animals[3:]) // [horse]
fmt.Println(animals[:])  // [dog cat bird horse]
```

To create a slice from an array we can use the last form `[:]`:

```go
languages := [5]string{"English", "Spanish", "Japanese", "German", "French"}
sLanaguages := languages[:]
```

What must be taken into account using this method is that a copy of the array is not made below the slice, access to it is simply limited according to the range of the new slice.
This means that if we have a slice with 1000 elements, and we make a new one with a range of 10 elements [:10], what will happen is that in the new slice we will only have 10 elements, but the array below will still have the 1000.
Occasionally, this can cause the program to keep all of the data in memory when only a small portion is needed.

### Add elements to a slice

As we saw before, an array cannot modify its length since it is part of its type, but the same does not happen with slices. To do this we have to create a new slice that is longer and copy the elements of the original slice to the new one.
To do this, Go provides us with a function called `copy(dst, src []T) int` which makes this task easier for us:

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}
newLanguages := make([]string, len(languages))
copy(newLanguages, languages)
```

Sometimes what we will need is to add elements to the slice in a more or less dynamic way depending on the case, beyond creating an entire copy of the slice while maintaining both slices at the same time.
Go helps us again with its function `append(s []T, x ...T) []T`, which adds the element x to the end of the slice, which will grow the capacity of the slice if necessary. Every time this happens, the array below the slice doubles its length, so it is something to keep in mind if we have to do optimization work.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}
languages = append(languages, "Chinese")
```

In addition to this, we can also add one slice to another with `...` as follows:

```go
myNums := []int{1, 2, 3}
yourNums := []int{4, 5, 6}
myNums = append(myNums, yourNums...) // equivalent to append(myNums, yourNums[0], yourNums[1], yourNums[2])
fmt.Println(myNums) // [1 2 3 4 5 6]
```

### Multidimensional slices

Just like with arrays, we can declare multidimensional slices by adding more dimensions by simply adding `[]` as `[][]int`.

```go
animalSounds := [][]string{
	{"lion", "roar"},
	{"dog", "barks"},
    {"cat", "meows"},
	{"frog", "croaks"},
    {"elephant", "trumpets"},
}
```

### Loop through slices

As with arrays, we can loop through the slices using the different types of loops.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for i:=0;i<len(languages);i++ {
    fmt.Println(languages[i])
}
```

We can also use range to cycle through the slices.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for index, value := range languages {
    fmt.Println(index)
    fmt.Println(value)
}
```

If we are only interested in the value, and not the index, we can omit it using the `_` operator.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for _, value := range languages {
    fmt.Println(value)
}
```

On the other hand, if we are only interested in the index, we can set the range equal to a single variable, and this will be the index.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}

for index := range languages {
    fmt.Println(index)
}
```

### Remove elements from a slice

Unlike arrays, with slices it is possible to eliminate elements from them, using the slicing method that we saw previously.
We must take the slice we want and cut it in part up to the index of the element to be eliminated, and add the same slice but with the remaining part +1, to eliminate the element from the index position.

```go
languages := []string{"English", "Spanish", "Japanese", "German", "French"}
indexToRemove := 3
languages = append(languages[:indexToRemove], languages[indexToRemove+1:]...)
```

### Sort a slice

You can sort the elements of a slice with the Go package `sort` https://pkg.go.dev/sort.

```go
slice := []int{12, 2, 90, 6, 88, 5, 28, 4}
sort.Ints(slice)
fmt.Println(slice) // [2 4 5 6 12 28 88 90]

languages := []string{"English", "Spanish", "Japanese", "German", "French"}
sort.Strings(languages)
fmt.Println(languages) // [English French German Japanese Spanish]
```

I recommend checking out the `sort` package to understand all the options there are.

### Search and filter items

As with arrays, to find elements of a slice we must recreate them and check the values of each position and detect if it is what we are looking for.
Additionally, with the slices we can filter these elements, creating a new slice without or with the elements found, depending on what we want.

```go
ages := []int{11, 16, 23, 38, 45}
adults := []int{}
for _, age := range ages {
    if age > 18 {
        adults = append(adults, age)
    }
}
```

I hope everything that I have tried to explain in this post has been clear, and please if there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
