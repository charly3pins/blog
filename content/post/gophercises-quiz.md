+++
layout = "post"
title = "Gophercises - Code Review"
subtitle = "Quiz game"
date = "2018-09-22"
author = "charly3pins"
description = "Quick steps to create your onw static blog with Hugo and install a theme from the catalogue. After that, push your site to GitHub and deploy it with GitHub Pages"
tags = ["go", "code review"]
categories = ["Code"]
image = "/img/puzzle.jpg"
showtoc = false
+++

This is the first of a several articles I am planing to write commenting the different exercises that I will do in [Gophercises](https://gophercises.com/).

> It's a FREE course that will help you become more familiar with Go while developing your skills as a programmer. In the course we will build roughly 20 different mini-applications, packages, and tools that are each designed to teach you something different.
>
> <b>Gophercises</b>

I like playing on this site because each exercise is focused in a set of Go packages and the way of they are presented is really clear and easy to understand. Also, the explanations in video are very helpful!

# Quiz game

[Exercise 1](https://gophercises.com/exercises/quiz) is about creating a program that will read in a quiz provided via a CSV file and will then give the quiz to a user keeping track of how many questions they get right and how many they get incorrect. Second part is adding a timer to make the game more interesting to play. At the end of the quiz the program should still output the total number of questions correct and how many questions there were in total. Questions given invalid answers or unanswered are considered incorrect.

On the first part the most exciting task is to work with `encoding/csv` and `flag` packages. First one is obviously for work with the CSV file where we'll have our quiz stored. Second one implements command-line flag parsing which we'll use it for injecting the name of the file when we execute the program. What I always do in this cases is go to the [official documentation](https://golang.org/pkg/) and check the `#pkg-index` anchor of the package that I'm intereseted. There are a list of all methods and types that the package contains. Then the `#pkg-examples` one is very helpful to clearify sometimes the method usage.

## Flag parse

First of all we want to know using flags the filename where is stored the quiz. If we check the [flag package](https://golang.org/pkg/flag/#pkg-index) we see that there are a lot of types supported, in this case we need the `String` one. Its signature is `func String(name string, value string, usage string) *string`. So, for reading the csv we'll need to use the method like this:
```go
filename := flag.String("csv", "problems.csv", "csv filename")
flag.Parse()
```

## Process CSV
Once we have the filename it's time to read it from the system. In my case I've used the `os` package to open the file. Note that I'm using a pointer to filename because the flag package returns pointer of type you want.
```go
f, err := os.Open(*filename)
```

Then it's time to use the `encoding/csv` package for reading the CSV.
```go
r := csv.NewReader(f)
rows, err := r.ReadAll()
```

With method `ReadAll()` we obtain a `[][]string` so we just need to loop over the slice obtained and parse it to the types we need. In this case the CSV contains two strings, first one the question and second one the answer. I've created a type that helps me manipulate the rows:
```go
type problem struct {
	question string
	answer   string
}
```
and use it in the parse function:
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

Finally it only remains to display the questions on the screen and request the user for the answers. For achieve this I've used the `fmt.Scanf()`[method](https://golang.org/pkg/fmt/#Scanf).

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

My entire solution for this part is on [this commit](https://github.com/charly3pins/gophercises/commit/3a841b67c154fbbb7749eb61612989be8c1127a9#diff-eef4eb636e863480b77d87bc3000e0d1)

## Adding timers