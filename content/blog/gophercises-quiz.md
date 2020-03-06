+++
title = "Gophercises - Quiz game"
date = "2018-09-24"
author = "charly3pins"
description = "Code review of my first exercise in the Gophercises page. It's focused in the CSV and time packages in addition to an introduction for the goroutines and channels."

tags = ["go", "code review"]

image = "/images/puzzle.jpg"
+++
This is the first of a several articles I'm planning to write commenting the different exercises that I'm doing in [Gophercises](https://gophercises.com/) page.

> It's a FREE course that will help you become more familiar with Go while developing your skills as a programmer. In the course we will build roughly 20 different mini-applications, packages, and tools that are each designed to teach you something different.
>
><small>Gophercises</small>

I like playing with Go on this site because each exercise is focused in a set of packages of the language and the way of they are presented is really clear and easy to understand. Also, the explanations in video are very helpful to see the final code once you've yours done.

# Quiz game

[Exercise 1](https://gophercises.com/exercises/quiz) is about creating a program that reads a quiz provided via CSV file, then give the quiz to a user keeping track of how many questions they get right and how many they get incorrect. Second part is about adding a timer to make the game more interesting to play ending the execution when the timer is expired. At the end of the quiz the program shall output the total number of questions correct and how many questions there were in total. Questions given invalid answers or unanswered are considered incorrect.

On the first part the most exciting task is to work with `encoding/csv` and `flag` packages. First one is obviously for work with the CSV file where we'll have our quiz stored. Second one implements command-line flag parsing which we'll use it for injecting the name of the file when we execute the program. What I always do in this cases is go to the [official documentation](https://golang.org/pkg/) and check the `#pkg-index` anchor of the package that I'm intereseted. There are a list of all methods and types that the package contains. Then the `#pkg-examples` one is very helpful to clarify sometimes the method usage.

## Flag parse

First of all, we want to know the filename where is stored the quiz using flags. If we check the [flag package](https://golang.org/pkg/flag/#pkg-index) we see that there are a lot of types supported, in this case we need the [String](https://golang.org/pkg/flag/#String). So, for obtaining the filename we'll need to use the method like this:
```go
filename := flag.String("csv", "problems.csv", "csv filename")
flag.Parse()
```

## Process CSV
Once we have the filename it's time to read it from the system. In my case I've used the `os` package to open the file. 
```go
f, err := os.Open(*filename)
```
<small>Note that I'm using a pointer to filename because the String method returns a `*string`.</small>

Then it's time to use the `encoding/csv` package for reading the CSV.
```go
r := csv.NewReader(f)
rows, err := r.ReadAll()
```

With method [ReadAll](https://golang.org/pkg/encoding/csv/#Reader.ReadAll) we obtain a `[][]string`, so we just need to loop over the slice obtained and parse it to the types we need. In the quiz game, we know that CSV file contains two strings, first one is the question and the second one is the answer. I've created a custom type called `problem` with two strings for manipulate the rows of the file:
```go
type problem struct {
	question string
	answer   string
}
```

Now it's time to convert each row read from the file to a `problem` struct. The easiest way is to loop over the map of rows and declare a slice of problems `[]problem` and initialize them with the values of the row that we are obtaining:
```go
func parseCSV(rows [][]string) []problem {
	problems := make([]problem, len(rows))
 	for i, row := range rows {
		problems[i] = problem{
			question: row[0],
			answer:   strings.TrimSpace(row[1]),
		}
	}
 	return problems
}
```
<small>I've initialized the problems var with the `len(rows)` because I knew the exact length and will not change during the execution. Being strict with the nomenclature, the type of our var problems is `[len(rows)]problem`. In Go when a slice have the length fixed is called array. You can read further on [this post](https://blog.golang.org/go-slices-usage-and-internals).</small>

Finally it only remains to display the questions on the screen and request the user for the answers. For achieve this I've used the [fmt.Scanf()](https://golang.org/pkg/fmt/#Scanf):
```go
problems := parseCSV(rows)
correct := 0
for i, problem := range problems {
    fmt.Printf("Problem #%d: %s = ", i+1, problem.question)
    var answer string
    fmt.Scanf("%s\n", &answer)
    if answer == problem.answer {
        correct++
    }
}
fmt.Printf("%d answers correct of %d questions.", correct, len(problems))
```

Check the entire solution for this part on [this commit](https://github.com/charly3pins/gophercises/commit/3a841b67c154fbbb7749eb61612989be8c1127a9#diff-eef4eb636e863480b77d87bc3000e0d1).

## Adding timers

On the second part we are asked to add a timer with a default value of 30s customizable via flags. We need to refactor the code to stop the execution when the time is expired.

On this part is introduced the `time` package used for measuring and displaying time. For do the task, we'll need to create a [Timer](https://golang.org/pkg/time/#Timer). The package provides [NewTimer](https://golang.org/pkg/time/#NewTimer) method which need a [Duration](https://golang.org/pkg/time/#Duration) as a parameter. Not casual the package provide a set of constants to convert time to nanosecond and then convert them to Duration. All togheter looks like this:
```go
timer := time.NewTimer(time.Duration(*limit) * time.Second)
```
<small>`*limit` is obtained via flag in same way we've obtained the filename in the first section.</small>

At this point we have the timer created and if we analyze it we see that it contains a channel inside. Let's see what it's a channel first of all and why it's useful in this case. 

>Channels are the pipes that connect concurrent goroutines. You can send values into channels from one goroutine and receive those values into another goroutine
>
><small>https://gobyexample.com/channels</small>

You can send value to channel `ch <- v` and you can receive from a channel and assign it to a var `v := <-ch`. Sends and receives block until the other side is ready. 

If you've checked the documentation for Timer, you'll see that says:

>When the Timer expires, the current time will be sent on C
>
><small>https://golang.org/pkg/time/#Timer</small>

So this means that we can use the Timer's channel to know when the timer is expired just checking if it contains any value or not. For this we can use a `select` (switch in other languages) inside our `for` loop and checking it. If we're in this case, we'll need to stop the quiz so we'll need to print the final result:
```go
select {
case <-timer.C:
	fmt.Printf("\n%d answers correct of %d questions.\n", correct, len(problems))
	return
}
```
<small>The `return` is because I want to break the loop and I don't want to use labels and gotos on this code.</small>

On the other hand, we need to cover the case when the timer is not expired, so we can add a `default` case printing the question and waiting for the answer. For achieve this, we just need to move our previous code inside the `select` block. The complete code for the loop:
```go
for i, problem := range problems {
	fmt.Printf("Problem #%d: %s = ", i+1, problem.question)
	select {
	case <-timer.C:
		fmt.Printf("\n%d answers correct of %d questions.\n", correct, len(problems))
		return
	default:
		var answer string
		fmt.Scanf("%s\n", &answer)
		if answer == problem.answer {
			correct++
		}
	}
}
```
At this point you could think that we have the program finished but if you execute it you'll see what happens. Yes! the `fmt.Scanf("%s\n", &answer)` is blocking and the program doesn't continues execution until the function receives a value. To solve this, we'll need to use a `goroutine` and move the blocking part inside. However, before that let's talk a bit about what are and how to integrate with our code.

>A goroutine is a lightweight thread managed by the Go runtime.
>
><small>https://tour.golang.org/concurrency/1</small>

So in Go the threads are called <i>goroutine</i> and they are easy to recognise because they are calls to a function preceeded by the keyword `go`. Using the golang tour example below, we see the goroutine is executing the `say` function concurrently passing the parameter "world" and in main thread we have the exeuction of `say` with parameter "hello".
```go
package main

import (
	"fmt"
	"time"
)

func say(s string) {
	for i := 0; i < 5; i++ {
		time.Sleep(100 * time.Millisecond)
		fmt.Println(s)
	}
}

func main() {
	go say("world")
	say("hello")
}
```
As we expected, the output of the program is not sequential and we obtain the 5x `hello world` sentences mixed.
```
world
hello
hello
world
world
hello
hello
world
world
hello
```

Knowing what is a channel and how to work with them and knowing the powerful of the goroutines, we can mix them to achieve our goal in this task. The channels allows goroutines to synchronize without explicit locks or condition variables between them. Let's do it!

First we move the question outside the `select` block and extract the `default` case in a goroutine like this:
```go
fmt.Printf("Problem #%d: %s = ", i+1, problem.question)
answerChannel := make(chan string)
go func() {
	var answer string
	fmt.Scanf("%s", &answer)
	answerChannel <- answer
}()
```
<small>As we read, we need a channel to talk between the goroutines (remember that the main thread is a goroutine in itself) so we have to create a new channel `answerChannel` and pass the user's response. </small>

Last but not least, we need to do is read the channel we've created. For this I've created a new `case` block:
```go
select {
case <-timer.C:
	fmt.Printf("\n%d answers correct of %d questions.\n", correct, len(problems))
	return
case answer := <-answerChannel:
	if answer == problem.answer {
		correct++
	}
}
```

Now we have all done, checking on the first case the Timer's channel to know if the time is expired and the second case receiving the user's answer every time he types on the screen, but without blocking the execution because we've moved this task to a `goroutine`.

The full code for the second part is available [here](https://github.com/charly3pins/gophercises/commit/2b821d0a9821cd6de93985a963e2a24350b34b7b).

# In summary
To sum up, I think this is a very good exercise to do because it introduces you a few useful packages like `encoding/csv` that I'm sure you'll need to use sometimes. There a lot of information that is stored in `.csv` and it's always useful know how to deal with it. Also it's a good starting point for the `channels` and `goroutines` (probably I'll dedicate an entire post to them). Here you can see how to work with them together and why are useful in a real case.

You can check the [complete repo](https://github.com/charly3pins/gophercises/tree/master/quiz) that I've created for this exercise.