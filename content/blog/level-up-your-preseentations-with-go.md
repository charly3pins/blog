+++
title = "Level up your presentations with Go"
date = "2020-10-06"
author = "charly3pins"
description = "Generate easily your presentations with present, the tool powered by Go that generates and renders your slides."

section = "blog"
tags = ["go"]

image = "/images/level-up-your-presentations-with-go/GOPHER_MIC_DROP_WITH_BACKGROUND.png"
+++

If you're a technical person and you don't like to battle with presentation softwares but you want/need to create one, congratulations! you are in the right place. I know that as software engineers we want to be coding or reading or watching things related with software, architecture or devops but not with presentations. Sometimes we are demanded to present something to other team members, to the product owners or even scarier, to the management team!

For that reason I want to introduce you to the Go package [present](https://godoc.org/golang.org/x/tools/present). It's used to create slides in Golang hosted on talks.golang.org or on your private one. I've used it several times, especially when I want to share something to my colleagues on the team (some code of course), because I don't want to waste time with softwares. I just create the project for the slides, add my slides in markdown, add the images needed and just present them to them. Let's see in detail how it works!

Assuming you have [Go installed](https://golang.org/doc/install) and correctly configured, all you need to install is the package with the following command:
```terminal
go get -u golang.org/x/tools/present
```

Test if it works typing:
```terminal
present
```

And it should display a message similar to:
```terminal
2020/10/04 23:23:54 Open your web browser and visit http://127.0.0.1:3999
```

So you can visit the link, and see the local server ready to host your presentations. Awesome or not? Okay, I know you want to display something other than an empty directory, so let's create an example presentation for that.

# Format

Create a directory for your slides:
```terminal
mkdir go-present-example
cd go-present-example/
```

Create your first slide:
```terminal
vim initial.slide
```

And add the following:
```terminal
Learning Go present
6 October 2020

Crash Bandicoot
crash.bandicoot@gmail.com

* Hello World

I'm a slide
```

So if you run again the `present` command inside your folder and go to the browser again you should be able to see the screen below:
![initial slide](/images/level-up-your-presentations-with-go/initial-slide.jpeg)

Click on the `initial.slide` link and admire your presentation!
![initial presentation](/images/level-up-your-presentations-with-go/initial-presentation.jpeg)

As you can see, the first line is the title, the second the date and then it's followed by the author. On the second slide, actually the first one, it appears the title of the slide and the text of that one. The last one displays a gratitude title and your name and contact (email, twitter, etc.) you added in the slide. See it below:
![end presentation](/images/level-up-your-presentations-with-go/end-presentation.jpeg)

# Legacy Present Syntax

It supports Markdown but here we will explore the [Legacy Present Syntax](https://godoc.org/golang.org/x/tools/present#hdr-Legacy_Present_Syntax), as the Markdown has a lot of resources where you can check. So let's explore a bit the features that `present` offers for formatting and displaying text in our slides.

First is the classical options for formatting the text:
```text
normal vs `highlighted`
*bold*
_italic_
*multiple*bold*text*
_multiple_italic_text_
```

And the result:
![text formatting](/images/level-up-your-presentations-with-go/text-formatting.jpeg)

Also you can add a list:
```text
Grocery list for the gopher:

- go routines
- garbage collector
- Rust
```
![text formatting list](/images/level-up-your-presentations-with-go/text-formatting-list.jpeg)

Or different level of subsections like that:
```
** Subsection

Gopher is diving the subsection.

*** Sub-subsection

Another Gopher is diving more into the sub-subsection!
```

And you will see the slide like that craziness:
![text formatting subsections](/images/level-up-your-presentations-with-go/text-formatting-subsections.jpeg)

![gophers](/images/level-up-your-presentations-with-go/gophers.gif)

# Command Invocations

Apart from text formatting there are a special [command invocations](https://godoc.org/golang.org/x/tools/present#hdr-Command_Invocations) that you can invoke to take your presentation to another level.

## images & videos
The `.image` command injects a picture in your slide. It accepts 1 or 3 arguments (name, height, width). Name is mandatory, other two must be present or substituted with an `_`.
```text
.image /images/gopher.jpeg 200 200
.image /images/gopher.jpeg _ 300
```

![images](/images/level-up-your-presentations-with-go/images.jpeg)

Like the pictures, you can do the same with a video using the `.video` command. It accepts 2 or 4 arguments (name, file content-type, height, width). Name and file content-type are mandatories, other two must be present or substituted with and `_`.
```text
.video videos/gopher-dance.mp4 video/mp4 400 600
.video videos/gopher-dance.mkv video/mkv 500 _
```

Similar to the images, it also has the `.background` command to set the background image for a slide. It has only one argument as the file name of the image.
```text
.background images/susan.jpg
```

## links
If you need to insert a link in your presentation you can use the `.link` command. It accepts 1 or 2 arguments (HTTP url, text label). HTTP url is mandatory, the second one is optional.
```text
.link https://charly3pins.dev charly3pins website
.link https://charly3pins.dev
```

![links](/images/level-up-your-presentations-with-go/links.jpeg)


## code
The best command imo is the `.code` one. It allows you to put code extracting them from the source files and injecting them as HTML-escaped <pre> blocks. It accepts one argument as the file name followed by an optional address that specifies what section of the file to display.

For example taking the Hello world in Go as a source code:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!")
}
```

We need to specify as:
```text
.code hello.go
```

And it will show like that:
![code](/images/level-up-your-presentations-with-go/code.jpeg)

But what happens if you want to highlight some part of the code? Don't worry, present has that "present" and you can add those "optional addresses" we commented below for that. So, modify the code like that to highlight the `Printf` call:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello world!") // HL
}
```
And use the same command in your slide:
```text
.code hello-hl.go
```

To see the code highlighted:
![code-hl](/images/level-up-your-presentations-with-go/code-hl.jpeg)

One step further! If you wanna show only a part of your code, for example hide the package and the imports of your file, you can also add the following snippets:
```go
package main

import "fmt"

//START OMIT
func main() {
	fmt.Println("Hello world!") // HL
}
//END OMIT
```
Again use the same command but adding the following snippet:
```text
.code hello-hl-partial.go /START OMIT/,/END OMIT/
```

And see the code partially displayed:
![code-hl-partial](/images/level-up-your-presentations-with-go/code-hl-partial.jpeg)

That command is superpowerful in order to help you present some code and highlight or hide some parts. But the show must go on, and the best part is the next one. The command `.play` is like the `code` one but it puts a button on the dispalyed source and you can run your program from the browser! Is it magic or not?
![magic](/images/level-up-your-presentations-with-go/magic.gif)

So let's use the same source-code that we are using and just add the new command to the slides like this:
```text
.play hello.go
```

It will appear like the `code` one but if you notice on the right bottom corner, it appears a small `Run` button.
![code-play](/images/level-up-your-presentations-with-go/code-play.jpeg)

Running the code will display a small black window on the screen displaying the output of the code:
![code-played](/images/level-up-your-presentations-with-go/code-played.jpeg)

# Presenter Notes

Last but not least is an interesting thing that they provide also. It's well known that in PowerPoint or similar programs you can add your notes only visible for you when presenting the presentation and they are very useful sometimes. So `present` has that in consideration as well and you can add your presentation notes just adding a `:` on the beginning of the sentence and that text will be treated as a presenter note.

For example:
```text
* Presenter notes

The gophers like to eat a lot.

: they eat more than half their body weight in food each day

They eat basically plants.

: typically gnaws the roots of a plant just beneath the soil, so the damage isn’t seen
```
![present-notes](/images/level-up-your-presentations-with-go/present-notes.jpeg)


As you can see the notes aren't present there, so WHY? Because you need to run the presentation in a "presenter" like that.
```terminal
present -notes
```

And it should display a message similar to:
```terminal
2020/10/04 23:23:54 Open your web browser and visit http://127.0.0.1:3999
2020/10/04 Notes are enabled, press 'N' from the browser to display them.
```

So if you refresh your browser with the presentation and press `N` you will see a popup displaying the notes of each slide on the bottom. like that:
![present-notes-popup](/images/level-up-your-presentations-with-go/present-notes-popup.jpeg)

# Conclusion

The `present` tool is super useful for technical presentations, especially in Go. It has its limitations like the format of the slides and the image positioning sometimes tricky, but in general is a great package and for me is the standard for all my presentations. If you wanna dick more in detail about that package check the [official documentation](https://godoc.org/golang.org/x/tools/present) and also I would recommend the [presentation](https://talks.golang.org/2012/insidepresent.slide#1): `Inside the "present" tool` by Andrew Gerrand. Also I've uploaded the source code for this tutorial on [GitHub](https://github.com/charly3pins/go-present-example).
