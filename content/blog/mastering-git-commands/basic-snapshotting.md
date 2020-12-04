+++
title = "Basic Snapshotting"
date = "2020-12-04"
author = "charly3pins"
description = "Mastering Git commands: Initial commands to make the basic snapshots of projects."

section = "blog"
tags = ["git", "terminal"]

image = "/images/git-tutorial.jpg"
+++
<!-- This article is part of the series Mastering Git commands.<LINK HERE> -->

In my [last post]({{< ref "/blog/mastering-git-commands/getting-and-creating-projects.md" >}}) we checked the initial commands in order to get a running Git repository. With that we have the directories and the files that Git needs to start working, so let's start working with it with the snapshotting commands.

## add
[git-add](https://git-scm.com/docs/git-add) - Add file contents to the index
```vim
git add [--verbose | -v] [--dry-run | -n] [--force | -f] [--interactive | -i] [--patch | -p]
	  [--edit | -e] [--[no-]all | --[no-]ignore-removal | [--update | -u]]
	  [--intent-to-add | -N] [--refresh] [--ignore-errors] [--ignore-missing] [--renormalize]
	  [--chmod=(+|-)x] [--pathspec-from-file=<file> [--pathspec-file-nul]]
	  [--] [<pathspec>…​]
```

This command updates the index adding the specified files in the command for the next commit. It can add a path as a whole, single files or removed paths/files. This command can be performed multiple times before a commit. You can use the [git status](#status) command to obtain a summary of which files will be on the next commit.

## status
[git-status](https://git-scm.com/docs/git-status) - Show the working tree status
```vim
git status [<options>…​] [--] [<pathspec>…​]
```

This command displays paths that have differences between:
- the index file and the current HEAD commit;
- the working tree and the index file;
- paths in the working tree that are not tracked by Git;

When it's performed it displays the information in those three parts. The first contains the files that you would commit by running [git commit](#commit); the second and third contains the files that you could commit by running `git add` before running [git commit](#commit).
![git status](/images/git-series/git-status.png)

## diff
[git-diff](https://git-scm.com/docs/git-diff) - Show changes between commits, commit and working tree, etc
```vim
git diff [<options>] [<commit>] [--] [<path>…​]
git diff [<options>] --cached [<commit>] [--] [<path>…​]
git diff [<options>] <commit> [<commit>…​] <commit> [--] [<path>…​]
git diff [<options>] <commit>…​<commit> [--] [<path>…​]
git diff [<options>] <blob> <blob>
git diff [<options>] --no-index [--] <path> <path>
```

This command shows changes between:
- the working tree and the index or a tree;
- the index and a tree;
- two trees;
- files resulting from a merge;
- two blob objects;
- two files on disk;

Basically the usage of the `diff` command is to know which files have changes in your project; then perform a `git add` to update the index with the desired changes.
![git diff](/images/git-series/git-diff.png)

## commit
[git-commit](https://git-scm.com/docs/git-commit) - Record changes to the repository
```vim
git commit [-a | --interactive | --patch] [-s] [-v] [-u<mode>] [--amend]
	   [--dry-run] [(-c | -C | --fixup | --squash) <commit>]
	   [-F <file> | -m <msg>] [--reset-author] [--allow-empty]
	   [--allow-empty-message] [--no-verify] [-e] [--author=<author>]
	   [--date=<date>] [--cleanup=<mode>] [--[no-]status]
	   [-i | -o] [--pathspec-from-file=<file> [--pathspec-file-nul]]
	   [-S[<keyid>]] [--] [<pathspec>…​]
```

This command creates a new commit containing the current contents of the index and the given log message describing the changes. The new commit is a direct child of HEAD and the branch is updated to point to it.

The option `-m` is the one that you will use the most; it is used to add a message to the commit in order to describe the changes you did. Related with that, I [wrote an article]({{< ref "/blog/custom-commit-messages.md" >}}) about a tool that allows you to format the commit messages.

If you need to replace your last commit for any reason, you can use the `--amend` option. Using it will replace the tip of the current branch by creating a new commit. The message from the original commit is used as the starting point instead of an empty message as usual. Take care of using that option because rewriting history has a lot of implications especially if it's already published. We will check in detail in the `git-rebase` section.

## reset
[git-reset](https://git-scm.com/docs/git-reset) - Reset current HEAD to the specified state
```vim
git reset [-q] [<tree-ish>] [--] <pathspec>…​
git reset [-q] [--pathspec-from-file=<file> [--pathspec-file-nul]] [<tree-ish>]
git reset (--patch | -p) [<tree-ish>] [--] [<pathspec>…​]
git reset [--soft | --mixed [-N] | --hard | --merge | --keep] [-q] [<commit>]
```

This command resets the index entries for all paths that match the `pathspec` to their state at `tree-ish`. Basically is the opposite of the `git add` command.

The most used option is the `mode`. The values that are most used among all it offers are the following:
- `--soft`: it resets the `HEAD` to the specific commit without touching the index file or the working tree at all. This leaves all your changed files as a "changes to be committed" (check them with `git status`). 
It's used normally to remove the last N commits using the `HEAD~N` as a `commit`, but the files changed will stay in your working tree.
- `--hard`: it resets the index and the working tree. All changes since `commit` are discarded. Be careful! Removing uncommitted changes never tracked by git will be impossible to get them back. 

To illustrate this a bit let's see an example. Imagine we have the following commits:
![git reset commits](/images/git-series/git-reset-commits.png)

If we perform:
```vim
git reset --soft
```
Nothing happens.

If we perform:
```vim
git reset --soft HEAD~2
```
And what happens is that the last 2 commits are reverted, so doing a git status it will show the `c.yaml` and `d.yaml` are "changes to be committed".
![git reset soft](/images/git-series/git-reset-soft.png)

Taking back again the commit history as example, if we perform:
```vim
git reset --hard
```
Nothing happens but a message appears.
```vim
HEAD is now at 1486856 added d
```

As the `HEAD` was already on that commit, we don't see any change, but the info is relevant because it's already warning us that this command will move the `HEAD` also, so be careful.

If we perform:
```vim
git reset --soft HEAD~3
```
And it will appear:
```vim
HEAD is now at 3a9f1a0 added a
```
So the `HEAD` points to the first commit we did and the `b.yaml`, `c.yaml` and `d.yaml` we added in the 3 following commits are lost because they weren't pushed to the remote repository.
