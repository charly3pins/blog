+++
title = "Getting and Creating Projects"
date = "2020-09-28"
author = "charly3pins"
description = "Initial commands to get and create projects."

section = "blog"
tags = ["git", "terminal"]

image = "/images/git-tutorial.jpg"
+++

Assuming that you already installed git and [configured](https://git-scm.com/docs/git-config) it on your computer, let’s start from the beginning and check the initial commands for initialize and download a repository.

## init
git-init - Create an empty Git repository or reinitialize an existing one
![git-init](/images/git-series/git-init.png)

This command creates an empty Git repository (a `.git` directory in the location you executed the command). This folder will contain some files and subdirectories that I will not cover in this post because they are too advanced for what I want to achieve with these articles.
On that point you can start the history of the repository by adding files to your Git repository, committing them locally and finally pushing the changes to the remote server. (We will cover all of those commands in next posts).

## clone
git-clone - Clone a repository into a new directory
![git-clone](/images/git-series/git-clone.png)

This command clones a repository into a new directory copying the remote project into your own repository instance (locally). Git supports ssh, git, http, and https protocols for communication between your local server and the remote server. The choice will depend on the needs and specifications of your project and your access level on it.
After performing that, you have all the code downloaded and the history from remote copied to your local Git, so you can continue from there and write your own one.