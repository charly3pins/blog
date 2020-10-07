+++
draft = true

title = "Basic Snapshotting"
date = "2020-10-07"
author = "charly3pins"
description = "Initial commands to get and create projects."

section = "blog"
tags = ["git", "terminal"]

image = "/images/git-tutorial.jpg"
+++
This article is part of the series Mastering Git commands.<LINK HERE>

In my [last post](/link-here) we checked the initial commands in order to get a running Git repository. With that we have the directories and the files that Git needs to start working, so let’s start working with it with the snapshotting commands.

## add
[git-add](https://git-scm.com/docs/git-add) - Add file contents to the index
<insert picture>

This command updates the index adding the specified files in the command for the next commit. It can add a path as a whole, single files or removed paths/files. This command can be performed multiple times before a commit. You can use the [git status](link to status) command to obtain a summary of which files will be on the next commit.
<insert picture example>

## status
[git-status](https://git-scm.com/docs/git-status) - Show the working tree status
<insert picture>

This command displays paths that have differences between:
- the index file and the current HEAD commit;
- the working tree and the index file;
- paths in the working tree that are not tracked by Git;

When it’s performed it displays the information in those three parts. The first contains the files that you would commit by running [git commit](link to commit); the second and third contains the files that you could commit by running `git add` before running [git commit](link to commit).
<insert picture example>

## diff
[git-diff](https://git-scm.com/docs/git-diff) - Show changes between commits, commit and working tree, etc
<insert picture>

This command shows changes between:
- the working tree and the index or a tree;
- the index and a tree;
- two trees;
- files resulting from a merge;
- two blob objects;
- two files on disk;

Basically the usage of the `diff` command is to know which files have changes in your project; then perform a `git add` to update the index with the desired changes.
<insert picture example>

## commit
[git-commit](https://git-scm.com/docs/git-commit) - Record changes to the repository
<insert picture>

This command creates a new commit containing the current contents of the index and the given log message describing the changes. The new commit is a direct child of HEAD and the branch is updated to point to it.

The option `-m` is the one that you will use the most; it is used to add a message to the commit in order to describe the changes you did. Related with that, I wrote an article <LINK HERE> about a tool that allows you to format the commit messages.
<insert picture example>

If you need to replace your last commit for any reason, you can use the `--amend` option. Using it will replace the tip of the current branch by creating a new commit. The message from the original commit is used as the starting point instead of an empty message as usual. Take care of using that option because rewriting history has a lot of implications especially if it’s already published. We will check in detail in the <git-rebase section> LINK HERE
<insert picture example>

## reset
[git-reset](https://git-scm.com/docs/git-reset) - Reset current HEAD to the specified state
<insert picture>

This command resets the index entries for all paths that match the `pathspec` to their state at `tree-ish`. Basically is the opposite of the `git add` command.

The most used option is the `mode`. The values that are most used among all it offers are the following:
- --soft: it resets the head to the specific commit without touching the index file or the working tree at all. This leaves all your changed files as a “changes to be committed” (you can check with `git status`). 
It’s used normally to remove the last N commits using the `HEAD~N` as a `commit`, but the files changed will stay in your working tree.
<insert picture example>
- --hard: it resets the index and working tree. All changes since `commit` are discarded. Be careful! Removing uncommitted changes never tracked by git will be impossible to get them back.
Performing the same action as we did in `--soft` mode the difference will be that we will lose all uncommitted changes in addition to the N commits we discarded.
<insert picture example>
