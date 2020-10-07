+++
draft = true

title = "Branching and Merging"
date = "2020-10-07"
author = "charly3pins"
description = "Initial commands to get and create projects."

section = "blog"
tags = ["git", "terminal"]

image = "/images/git-tutorial.jpg"
+++

This article is part of the series Mastering Git commands.<LINK HERE>

In my [last post](/link-here) we checked the commands for managing the snapshots in Git. We saw how we can add files, commit the changes adding a message, check the status of the files in our project and how to undo changes using the reset. In this post we will cover the most important commands in Git and where all the powerful are condensed. Let’s get dirty with the branching and merging things.

## branch
[git-branch](https://git-scm.com/docs/git-branch) - List, create, or delete branches
<insert picture>

This command lists the existing branches by default or using the `--list` option; the current branch is highlighted and marked with an asterisk. Using the `-r` option will show the remote branches and the `-a` will display both local and remote branches.
<insert picture example>

When a local branch is started off a remote-tracking branch, Git sets up the branch so that `git pull`<LINK HERE> will appropriately merge from the remote-tracking branch. 

Apart from the options commented before, the most used are the below ones:
- -d/--delete: it deletes a branch. The branch must be fully merged in its upstream branch or it will trigger an error. The `-D` is the shortcut for `--delete --force` and it allows git to delete the branch independently of its merged status.
<insert picture example>
- -u/--set-upstream-to: set up `branch name` as the tracking information so `upstream` is considered `branch name`’s upstream branch. If no `branch name` is specified, then it defaults to the current branch.
<insert picture example>

## checkout
[git-checkout](https://git-scm.com/docs/git-checkout) - Switch branches or restore working tree files
<insert picture>

This command updates files in the working tree to match the version in the index or the specified tree. If no `pathspec` was given, it will also update `HEAD` to set the specified branch as the current one. Basically it is used to switch between branches.
<insert picture example>

The most used options for that command are:
- -f/--force: used to throw away local changes.
<insert picture example>
- -b <new_branch>: creates a new branch named `new_branch`.
<insert picture example>
- -B <new_branch>: creates a new branch named `new_branch`; if it already exists, then resets to the start point.
<insert picture example>

## merge
[git-merge](https://git-scm.com/docs/git-merge) - Join two or more development histories together
<insert picture>

This command incorporates changes from the named commits into the current branch. It is used by `git pull`<LINK HERE> to incorporate changes from another repository and can be used by hand to merge changes from one branch into another.
<insert picture example>

There are two types of merges that Git can perform: a fast-forward (--ff) or a no-fast-forward (--no-ff).

### fast-forward merge
Is the default mode used by Git. When possible, it only updates the branch pointer to match the merged branch; do not create a merge commit. When not possible, it creates a merge commit. What it means is if the current branch has no extra commits compared to the branch we’re going to merge; it will just update the HEAD pointing to the commit from the branch.
<insert picture example>

### no-fast-forward merge
Sometimes the --ff merge will be possible, but that’s rarely the case that the current branch doesn’t have any extra commits compared to the branch you want to merge, so in that case Git creates a `merge commit` and updates the pointer. That “parent” commit points to the active branch and also points to the branch that we want to merge.
<insert picture example>

### merge conflicts
When a merge occurs, the working tree files are updated to reflect the result of the merge. If one branch of the merge has changes in an area of a file while the other branch hasn’t (or vice versa), those changes are incorporated in the final result. The problem appears when both branches contain changes to the same area, then Git cannot randomly pick one side or another, and we need to tell him which of the two options we want to keep resolving the conflicts it will display.
<insert picture example>

When you see a conflict you can decide not to merge using the `--abort` option or you can decide to resolve the conflicts. In the second case, edit the files keeping the changes you want and run `git add` for adding to the index. After that you can perform a  `git commit` or if you wanna be safer perform a `git merge --continue` in order to check where there is a merge in progress before calling `git commit`. For that you can use the `mergetool`<LINK HERE>
<insert picture example>

## mergetool
[git-mergetool](https://git-scm.com/docs/git-mergetool) - Run merge conflict resolution tools to resolve merge conflicts
<insert picture>

This command is used to run one of several merge utilities to resolve merge conflicts. 
<<< P E N D I N G    I N V E S T I G A T E >>>

## log
[git-log](https://git-scm.com/docs/git-log) - Show commit logs
<insert picture>

<<< P E N D I N G    I N V E S T I G A T E >>>

## stash
[git-stash](https://git-scm.com/docs/git-stash) - Stash the changes in a dirty working directory away
<insert picture>

<<< P E N D I N G    I N V E S T I G A T E >>>

## tag
[git-tag](https://git-scm.com/docs/git-tag) - Create, list, delete or verify a tag object signed with GPG 
<insert picture>

<<< P E N D I N G    I N V E S T I G A T E >>>
