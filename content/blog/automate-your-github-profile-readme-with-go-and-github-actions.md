+++
title = "Automate Your GitHub Profile README with Go and GitHub Actions"
date = "2021-03-16"
author = "charly3pins"
description = "Create a dynamic Markdown file for your README with the help of Go and deploy it to your profile's GitHub using GitHub Actions."

tags = ["go", "github", "ci/cd"]

image = "/images/github-profile-readme/charly3pins-profile.png"
+++
After the post where I explained [how to create a README for the GitHub profile]({{<relref path="/blog/build-an-awesome-github-profile-readme.md" lang="en">}}), I missed including in the section of the `Blog` a link to the last post published. I mainly didn’t because I didn’t want to have to manually update the README every time with the last post and its link. To solve this I was thinking how I could automate this update. While doing my daily reading of the RSS feeds I follow with the Feedly app, I stumbled upon that I also had RSS feeds. So I could read my blog feed myself and get the latest post from there easily.

Once I covered the part of how to get the last post published, I missed the part of how to update the README and that's where I first tried (I had been wanting for a long time) the [GitHub Actions](https://github.com/features/actions). Some time ago GitHub launched these actions that basically serve to create automatic workflows for [CI/CD](https://en.wikipedia.org/wiki/CI/CD).

With both parts of the problem covered, I was just missing a little thing... do it! So I will explain in detail how I did both so you can use it in your project if you are interested.

## Get the latest post with Go

I needed to scan the blog feed and wanted to do it in Go, so the first thing I did was look for any libraries that would make it easier for me not to reinvent the wheel and I found the [github.com/mmcdole/gofeed](https://github.com/mmcdole/gofeed). It had a lot of features but I had enough with the basic use described in its README.

With the next piece of code, I create a new parser, scan the address of my feed and the resulting items, I save only the first one, as it is the last post posted.
```go
p := gofeed.NewParser()
feed, err := p.ParseURL("https://charly3pins.dev/index.xml")
if err != nil {
    log.Fatalf("error getting feed: %v", err)
}
newestItem := feed.Items[0]
```

With that I already have the item with all the information. It looks like:
```xml
<item>
    <title>My productivity setup for VS Code</title>
    <link>http://charly3pins.dev/blog/my-productivity-setup-for-vs-code/</link>
    <pubDate>Tue, 09 Mar 2021</pubDate>
    <guid>http://charly3pins.dev/blog/my-productivity-setup-for-vs-code/</guid>
    <description>I am gonna show you my setup for VS Code editor which makes me more productive and I feel more comfortable with the tool that I spend most of my time during the day.</description>
    <content><p>I spend a lot of hours during the day coding for the company I work for and during nights or weekends for myself, so I want to be comfortable with the tools I use constantly. One of them is my editor of code, specifically <a href="https://code.visualstudio.com/">VS Code</a>.....</content>
</item>
```

What I'm interested in showing in README is just the `title` and the `link`.

## Read and write the README

Once I had the necessary information I now had to read the `README.md` file from the [repository](https://github.com/charly3pins/charly3pins), write the changes and save it again.

To do this I could read the file using the standard library `ioutil.ReadFile()`, but in this case since I don't want to reuse anything from the file, so I can call `os.Create()` directly to create a new file and so overwrite the README.md that I already had in the directory.

Also, since I want to put the feed information along with the static part of text I already had, what I will do is create a few strings with the different sections I want to put in the profile and then put them all together using `fmt.Sprintf()`.

The code that does all this is this:
```go
file, err := os.Create(filename)
if err != nil {
	log.Println("error creating file", err)
	return
}
defer file.Close()

_, err = io.WriteString(file, data)
if err != nil {
	log.Println("error writing content to file", err)
	return
}
file.Sync()
```

What remains to be seen from here is the value of `filename` and that of` data`. The first is easy, just the route to get to the README. In my case as I have the project in a subdirectory of my repository I have to use `filename = ../README.md`. For the other variable, what is there is this:
```go
hi := "# Hey there!"
blog := "## Blog\n\nMy latest blog post is: **[" + newestItem.Title + "](" + newestItem.Link + ")**."

data := fmt.Sprintf("%s\n\n%s\n\n%s\n\n%s\n", hi, blog)
```

The important part is the `blog` where you can clearly see how I read the feed information.

You can see the complete code in [my repository](https://github.com/charly3pins/charly3pins/blob/main/update/main.go).

## Running the process automatically

Once we have the code that generates the README automatically and dynamically according to the last post, what remains to be done is to run it periodically and in order to do not have to worry about anything. To do this I will use a [trigger](https://docs.github.com/en/actions/reference/events-that-trigger-workflows) from GitHub Actions so that every time I push to branch `master` run the process and also run it on a scheduled basis every Sunday at 12am.

First of all I need the `.github/worfklows` folder and inside I create the `update.yaml` file with the following content:
```vim
on:
  push:
    branches:
      - master
  schedule:
    - cron: '0 0 * * 0'
```

Once the trigger is ready, what needs to be defined are the [jobs](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobs). You can define as many as you want, in my case with 3 I have enough. The first will `checkout` the project, the second will `generate` the README, and the third will `deploy` the changes. For the last step we will need to use the [authentication mechanisms](https://docs.github.com/en/actions/reference/authentication-in-a-workflow) provided by GitHub Actions. The resulting code is:
```vim
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: checkout repo
        uses: actions/checkout@master
        with:
          fetch-depth: 1
      - name: generate README
        run: |
          cd ${GITHUB_WORKSPACE}/update/
          go run main.go
      - name: deploy changes
        run: |
          git config user.name "${GITHUB_ACTOR}"
          git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
          git add .
          git commit -am ":rocket:: updated content"
```    

You can see the full code in [my repository](https://github.com/charly3pins/charly3pins/blob/main/.github/workflows/update.yaml).

Feel free to comment here or contact me on my social media for any comments, questions or suggestions.
