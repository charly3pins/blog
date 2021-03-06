+++
title = "Building static blog with Hugo"
date = "2018-09-22"
author = "charly3pins"
description = "Quick steps to create your own static blog with Hugo and install a theme from the catalogue. After that, push your site to GitHub and deploy it with GitHub Pages."

tags = ["hugo", "cms", "github"]

image = "/images/gohugoio-card.png"
banner = "/images/gohugoio-card-banner.png"
thumb = "/images/gohugoio-card-thumb.png"
+++
If you want to create a fast static website I recommend you [Hugo](https://gohugo.io/). It's written in Go and it's really use to configure and adapt to your needs. In addition, you can choose through different [themes](https://themes.gohugo.io/) created by the team and others by the community or even create your own one.

Here I'll explain in some steps how to create one blog with Hugo and how to be hosted & deployed in GitHub and GitHub Pages. If you need more detail visit the official [Hugo docs](https://gohugo.io/documentation/).

## Start
First of all you need to install Hugo, in my case using [Homebrew](https://brew.sh/):
```vim
brew install hugo
```

Check the version installed:
```vim
hugo version
```

## Create site
Once you have Hugo installed, you're able to create your website using the command:
```vim
hugo new site your-blog-name
```

After that, you'll see a new folder called `your-blog-name` and if you look inside you'll see the following tree:
![Folder tree](/images/build-hugo-static-blog/folder-tree-your-blog-name.png)

* Archetypes are content template files for your project, used when you run `hugo new` command.
* Content is where all posts and pages are stored. The same structure in this folder will be used for organize the URLs in your rendered site.
* Data is a folder for store additional data for generating your site.
* Layouts is the folder where are stored the template of your site if you're not using a theme.
* Static stores all static files for your site.
* Themes is where the themes you install are stored.
* config.toml stores the main configuration for your site.

## Install theme
If you want to use a theme already created you can do it in two ways. To check the existing themes visit the official [Hugo themes](https://github.com/panr/hugo-theme-hello-friend) website where you can see a demo of each one.

First of all you need to init a git repo inside your project:
```vim
cd your-blog-name;\
git init;
```

Then you can clone the repo inside the `themes` folder:
```vim
git clone https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend
```

If you don't want to make any changes, it's better to include the theme as a git submodule and you can get new updates when they are available. Do it with:
```vim
git submodule add https://github.com/panr/hugo-theme-hello-friend.git themes/hello-friend
```

## Create content
For generate your first blog post you can use the command `hugo new` and set the path you want, in my case `posts`:
```vim
hugo new posts/my-first-post.md
```
You will obtain the following file:
![Example post](/images/build-hugo-static-blog/example-post.png)

The first section is for parameters and the second one is for the content in this case in markdown. Check this [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) a quick reference and showcase.

## Run your site
Once you have created the post you can build your site using the `hugo server` command. The flag `-D` is for render drafts:
```vim
hugo server -D
```
And it will appear the rendering logs and at the end message similar to:
```vim
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
```
Copy the URL to your browser and you will see your site up and running!

## Host on GitHub
We'll use the User/Organization Pages `https://<USERNAME|ORGANIZATION>.github.io/`.

Create a `<YOUR-PROJECT>` repository on GitHub. This repository will contain Hugo’s content and other source files.

Create a `<USERNAME>.github.io` GitHub repository. This is the repository that will contain the fully rendered version of your Hugo website.

```vim
git clone https://github.com/<USERNAME>/<YOUR-PROJECT>
cd <YOUR-PROJECT>
```

Run your website locally using the command `hugo server` or if you are using theme `hugo server -t <THEME_NAME>`. Follow the instructions in console to access it. Web server should be available at  http://localhost:1313/

Finally you need to add the `<USERNAME>.github.io` repo inside the `public` folder as a git submodule in order to update your website once you regenerate the site. 

```vim
git submodule add -b master git@github.com:<USERNAME>/<USERNAME>.github.io.git public
```

If you don't have the RSA pair key configured you'll need to add the submodule via HTTP:

```vim
git submodule add -b master https://github.com/<USERNAME>/<USERNAME>.github.io.git public
```

To automate the next steps you can save it to `deploy.sh`. Remember to make it executable with:
```vim
chmod +x deploy.sh
```

deploy.sh
```shell
#!/bin/bash

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

# Build the project.
hugo # if using a theme, replace with `hugo -t <YOURTHEME>`

# Go To Public folder
cd public
# Add changes to git.
git add .

# Commit changes.
msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Come Back up to the Project Root
cd ..
```