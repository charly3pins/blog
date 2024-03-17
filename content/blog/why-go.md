+++
title = "Why Go?"
date = "2023-12-05"
author = "charly3pins"
description = "I have been asked many times why I am using Go, what it gives me and what are the reasons why I continue with this programming language. I am going to try to answer this question, in theory, simply, with the main reasons why I continue to be fascinated with it."

trending = true

tags = ["go"]

image = "/images/gopher-nerdy.png"
+++
## First contact
It's been about 8 years since I started playing with Go. At that moment I met a colleague who had left my workplace to try his luck at a new challenge in his professional career. One day talking to him he told me that they had decided to use a programming language called Go and that he was delighted with how easy it was to do things that with Java, the language we were used to using, was tremendously crude and sometimes complex, due to to the number of layers and repetitions you have to add. That's when I told him to show me how it worked and where I met Go.

I tried making some API with an HTTP server and in a matter of minutes, I had it running and launching curls without any problem. That same year, a few months later, I had the opportunity to participate in an operational automation project where he worked and we did it by setting up several APIs in Go. Communicating between them, also with some AWS tools like AWS Lambda coded in Go as well. The project was a success and the biggest company decided to buy that. 

After that I continued working with Go in my next (current) company where I worked, building a truly microservices environment with Go as the main language in Backend replacing a Typescript monolith.

Why we have chosen `Go`? Let me try to number a few things that made us choose Go versus other programming languages.

## Manifest
Go `code is very obvious`, there is the joke that it is a boring code, and that's fantastic.

Go is a really `fast language`. Because Go is compiled, it will naturally outperform languages that are interpreted or have virtual runtimes. The compiling time is extremely fast, and the resulting binary is very small. That allows you to deploy several times every day, so that follows the DevOps methodology perfectly.

Go's `syntax is small but powerful`, so it's easy to learn. You can fit most of it in your head, which means you don't need to spend a lot of time looking things up. It's also very clean and easy to read. Non-Go programmers, especially those used to a C-style syntax, can read a Go program and usually understand what's going on.

Go is a `strongly, statically typed language`. There are primitive types like int, byte, and string. There are also structs. Like any strongly typed language, the type system allows the compiler to help catch entire classes of bugs. Go also has built-in types for lists and maps, and they are easy to use.

Go has `interfaces`, and any struct can satisfy an interface simply by implementing its methods. Go also has first-class functions, which open up the possibility to write your code in a more functional style.

Go has a nice `standard library`, so usually the Go programs have few external dependencies. It provides handy built-in functions for working with primitive types. Some packages make it easy to set up a web server, handle I/O, and data manipulation. JSON serialization and deserialization provided by the standard library is trivial.

Go makes `concurrency` easier than in other languages. Using goroutine(s) and channel(s) it's almost trivial, while more complex patterns are possible.

Go provides out-of-the-box `testing` support in its standard library. There is no need for an extra dependency. If you have a file called thing.go, write your tests in another file called thing_test.go, and run "go test". Go will execute those tests automatically.

Go `static analysis tools` are numerous and robust. One in particular is `gofmt`, which formats your code according to Go's suggested style. Since there is a single code format and a great standard lib, you can focus on creating business value, not discussing where to put this condition or how to define that data structure.

Go provides a `memory safe` allocating dynamic objects and `garbage collecting` them, all that is made simpler than C and C++. Also, it makes using pointers much safer because it doesn't allow pointer arithmetic. It also gives you the option of using value types.

**Bonus**
Go coding style follows the [line of sight](https://medium.com/@matryer/line-of-sight-in-code-186dd7cdea88): the idea is that down the edge of your function, should be the happy path, so it's in the left edge. Anything else, being an error or an edge case, it's not the happy path, so you should indent it. With that, the code is super readable and easy to follow, and you don't need to use `else` in probably 99% of the cases. When you have in front of you the Go code and you see there is a part of the code indented, you know that's the exit of the function and the happy path it's on the left edge.

Simple, clean, great, GO!

I hope everything that I have tried to explain in this post has been clear, and please if there is any part that has not been completely clear or there are parts that I have not covered that you would like me to do, leave me a comment right here or through my social networks that you have on my profile and I will be happy to respond.
