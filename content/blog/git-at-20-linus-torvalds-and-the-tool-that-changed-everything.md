+++
title = "Git at 20: Linus Torvalds and the tool that changed everything"
date = "2025-04-21"
author = "charly3pins"
description = "Git turns 20, and Linus Torvalds shares how he built it in 10 days. Here's why it's still the king of version control."

tags = ["software-engineering", "git", "version-control"]

image = ""

+++

Git hit `20` this month—two decades since Linus Torvalds pushed the first commit on April 7 in 2005, calling it “the information manager from hell.”

{{< rawhtml >}}

<div style="text-align:center;">
    <img width="50%" src="/images/first-commit-git.png">
</div>

{{</ rawhtml >}}

GitHub marked the milestone with a [Q&A with Linus](https://www.youtube.com/watch?v=sCr_gb8rdEI) himself.
The legend built Git in _10 days_ to save the Linux kernel from version control chaos.

Git is a freaking masterpiece—fast, flexible, and the backbone of how we code today.
Let’s unpack what Linus said and why Git’s still unbeatable.

## Why Git exists?

Linus didn’t wake up dreaming of a version control empire. He was pissed off. Why?
Well, the Linux kernel team was stuck with BitKeeper, a proprietary tool that clashed with open-source vibes.
When the licensing drama killed it, CVS and SVN were the other options—both slow, centralized, and, in Linus’s words, “lipstick on a pig”.
With that context, he spent four months thinking into a solution that was better, and then 10 days of coding a system that worked _for him_.

That’s the first lesson: Git was born from a real problem, not some guru’s TED Talk. It’s why it feels so raw and honest.

> “I wanted something that works for me, and I won’t care about anybody else.” — Linus Torvalds

How many projects are created always for a personal use case solving the creator's problema and they became successful?
If you don't know what to build on where to find problems, check your daily life. The small pains that you are suffering every day, or your friends, faimily, wokmates, and you will find hidden gems.
Linus did it, why you can't?

That selfish spark made Git different.
Unlike CVS’s clunky versioning or SVN’s centralized system, Git’s distributed design lets you work offline, commit locally, and sync later. It's not the center of everything, it's just a tool to "store" your code.
It’s you and your code, no babysitting servers.

In 2025, simplicity, flexibility, and freedom are things we all crave. Git achieved that 20 years ago—how cool is that?

## The Genius of Git

Linus’s big flex? Speed.
He wanted to apply 50-100 patches in 30 seconds, not go grab a coffee between merges.
Git’s built like a filesystem—every commit’s a snapshot, hashed with SHA-1 to catch corruption.
Linus regrets SHA-1’s security holes (SHA-256’s a pain to retrofit), but it kept Git lean and reliable.
The result? You can easily branch, merge, and rebase.
Try that with SVN without losing your mind. Then, go back to Git and get on with your life.

Early on, people whined Git was “hard” or “unintuitive.”
Linus gets it—CVS users were used to incrementing numbers (1.3.1), not 40-character hex hashes.
But that complexity hides power. Once you understand and master Git’s model (trees, blobs, commits), it’s a Swiss Army knife.

In 2025, I'm managing many repos for Go, some JS (yes, I know...), a few side projects, docs, and other weird things—Git handles it all without blinking.

## Linus’s minimalist vibe

Linus keeps it real. He still uses Git, but he admits that he is not a hardcore user. He has some scripts that analyze the commands he uses most, and his top five the last time he ran them were `git merge`, `git blame`, `git log`, `git commit`, `git pull`, and sometimes `git status`.
No fancy wrappers, no editor plugins, just the CLI and his ancient MicroEMACS.
He's even maintaining the ancient version of his IDE since is not being maintained any more and he compiles the source code every time he wants to install it into a new computer.
He knows that the new IDEs are better-have colours, have plugins, have automations, but his fingers are so used to that old EMACS IDE and although he tried, he's not able to switch.
What a legend!

My take? That’s Git’s beauty—you don’t need a PhD. Learn `commit`, `push`, `pull`, `branch`, and you’re 80% there.
For the rest, read the [documentation](https://git-scm.com/) and play with them to get used to it.

Compare that to the gurus we ranted about last week, peddling “10x workflows” that crash in a sprint.
Git’s not sexy—it’s a workhorse.
Whether you’re a solo dev or on a 100-person team, it scales.
I’ve seen it hold up in chaotic startups and boring enterprises alike.
No other SCM comes close.

## The handoff

Linus admits he gets too much credit—He worked on Git four months approx and then hand it to Junio Hamano, who's been steering it for 19+ years.
He together with hundreds of contributors made Git what it is.
That’s open source done right: one guy sparks it, the community carries it.
In the Q&A, Linus says he’s a “casual user” now, barely following the Git mailing list.
He built a tool so good he doesn’t need to babysit it.

How impressive is that?

He built it for himself and never considered the other uses, but lucky for us, he found a maintainer who is amazing, and we all benefited from that "pet project" that he needed to keep going with his kernel.

## Why Git rules in 2025?

Git’s not just a tool; it’s a mindset.
Its distributed nature flipped how we collaborate—init(or fork), code, pull request, repeat.
GitHub, GitLab, and others identified an opportunity to make its usage easier and more user-friendly, and make all kinds of projects possible that we all know nowadays.

Linus didn’t see it coming.
He thought Git was just for him, not the world.
Yet here we are, with devs in 2025 using Git for _everything_—code, docs, even data pipelines.

Is it perfect? Not really.
Linus wishes bug tracking were less fragmented, and SHA-1’s a headache.
But Git’s resilience is nuts—20 years and it’s still the default.
Mercurial tried to compete but got smoked by network effects and GitHub’s rise.

My opinion? Git’s incredible because it’s practical, not flashy.
I can do:

```vim
git init
```

and then focus on coding, not fighting my tools.

Every time I `git commit`, I’m grateful Linus was pissed off in 2005.

## Wrapping Up

Git’s 20th birthday isn’t just a milestone—it’s proof that real problems breed real solutions.
Linus Torvalds didn’t set out to change the world; he just wanted a tool that didn’t suck.
Mission accomplished. If you’re still here, props—check the full Q&A in [YouTube](https://www.youtube.com/watch?v=sCr_gb8rdEI).

Share your Git stories on [LinkedIn](https://www.linkedin.com/in/carlesfuste/) or [Twitter/X](https://x.com/charly3pins), or subscribe to [Tech Trenches](https://techtrenches.substack.com/) for more from the trenches.

Happy coding!  
{C3P}
