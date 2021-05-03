+++
title = "What I learned defining the Selection Process for a Software Engineer in the startup where I work"
date = "2021-05-04"
author = "charly3pins"
description = "Learnings and tips I can share with you after three months interviewing different candidates."

tags = ["life", "startup"]

image = "/images/software_engineer_word_cloud.jpg"
+++
## Introduction

I have been working at [AREX Markets](https://arex.io) since November 2018 and since then, the company has changed a lot. When I joined it we were a team of aprox 10 people (~5 techs) and now we are close to 50. I have always liked the startup environment more than a big enterprise because of all the challenges that this entails. You have to do a lot of things and be involved in a lot of issues, as your job position or other unrelated ones, and I like that a lot. During the last weeks, or rather months, we have been interviewing a lot of people as we are growing in terms of business and we need to scale the technical team, so we started with the hiring of more software engineers.

The first step was defining what kind of **Selection Process** we wanted to follow. We did it all the team together and that was the first valuable thing we can extract. If you pretend to define a selection process in your company without the input from the team that will participate in it, that's bad. Everybody needs to give their input and be involved on that part as later on they will be part of it and if all goes successfully the new member will join the team, so they need to be comfortable with the decision.

Having said that, you could be asking what's that process? Let me summarize it in the following lines.

## Selection Process

*-* First of all the hiring manager has a **call** with the candidate to explain the details of the team, tech stack, the role duties and basically knowing him/her and clarify the possible doubts he/she could have.

*-* If the call is okay, the next step is to do the **Technical challenge**. For that we offer 3 options.

- **Technical challenge**. Classic challenge that you send to the candidate an exercise to solve in X days.

- **Technical portfolio**. If the candidate has a project(s) that cover the minimum requirements expected in the Tech Challenge can share them with the team instead of doing a Tech challenge. (Ex: sharing the repo in GitHub).

- **Live coding session**. Invitation to the candidate to do a coding session together in our office. (For obvious reasons during this year this option wasn't possible to do).

*-* **Technical review**. The team reviews the code from the candidate and has a call with him/her where they give the feedback from the code reviewed and ask questions and clarify doubts to the candidate more focused in the team and tech stack.

*-* **Product interview**. If the Technical review is okay, the last step is to have a call with the Product team to see if the candidate apart of having the tech skills needed (validated on the previous phase), it has the mentality and attitude that the team needs.

*-* **Final feedback**. After the last call the candidate receives feedback being hired or not. Depending on the case it is a call or an email. 

As you can see the process is not super innovative or disruptive but it is the one we all agreed and were comfortable working with. One thing that I want to highlight is regarding the Technical part. We all has been in interviews before and we wanted to do the process that we would have liked to find if we had been the interviewees. For that reason we offered the option of showing code already done instead of yes-or-yes asking for a technical challenge per se. That was a must because we all have spent a lot of hours in a tech challenge and then we end up with no feedback at all, just an email saying thanks for participating but sorry you're not the chosen one. That's the first point and the second is related to the last sentence; we agreed to do a phone call to every candidate that presented the technical part, even if we don't like it or we have doubts, the call was a must. We failed on that part because at the end with a lot of candidates on the pipeline we had to cancel I believe 2-3 calls, but for the remaining 90% we did. That was really helpful for us in order to clarify the doubts in the code review and to ask more questions and going deep in some topics with the candidates. Also to see how they react against positive/negative feedback and the kind of answers or arguments they tried to use to justify the wrong things. That was really productive in my opinion and the part that I enjoyed most in the whole process. Also, the final feedback was another mandatory thing for us so we elaborate a list with the comments although it was a declined candidate, but in order to give him/her the most valuable information possible to know why we didn't choose him/her.

## Code Review

Focusing with the code reviews, I elaborated a list with the more common things that we found during that phase and I think it's important to share with you in order to check it if you're interviewer but also if you're gonna be interviewed and you're in the technical challenge part, check these points before you submit it:

*-* **Poor README**. This was the biggest issue we've found in all across the candidates. Except a few ones, the majority provided a very short README with no indicatoins in how to run the project, or not detailed enough. Not indicate the dependencies needed (if you need to download or install something in order to run it). No explanation of the commands (if Makefile provided). No explanation regarding what's the project about (specially important with the ones that weren't solving our Tech Challenge). Lack of TODO with the pending features that weren't possible to cover but added there as an invitation to be discussed in the technical revision call.

*-* **Failing tests**. Some of the challenges, luckily a few, weren't passing their own tests. Basically that means the candidate didn't execute the tests before submitting the challenge and that's a red flag for that part.

*-* **Very few comments across the code**. I will be honest with you, I don't like comments in the code. For me a code that needs comments, is a code that is complex. So the code should be simple enough that is understandable without comments, otherwise you're over complicating it. Having said that, in Go the documentation is autogenerated for the exported types, functions, methods, etc... from the comments. So these comments are the ones that I accept and I personally think are necessary for understanding the context, but not the comments like "getting user" a line above the "repo.getuser()".

*-* **Code commented**. Some challenges arrived with a lot of commented code. Not the comments I was saying before for document the code. I mean code commented with `//`  or entire blocks `/**/`. We all know that for Technical challenges specifically, usually the time you have is reduced as you're working in a site and you wanna change, so you apply to different places. Then if you pass the initial phase you're asked to show your code. So you can end up with N tests to deliver for the same week, apart from your daily job and your "real life". But if you quickly check your code you will find it easily if you commented some code just for testing or for an initial approach and then don't need it anymore, and clean it before submitting it.

*-* **Hardcoded values**. Related to the previous point there were a lot of challenges with hardcoded values that caused the reviewing team to manipulate the code in order to make it run or make the tests pass. As much as possible try to use environment variables or provide a config file. And if none of that is possible at least add a section in the README with those.

## Results

Having applied all this and having iterated during these months the numbers I think are pretty good. We have all made a very big effort devoting a lot of time to the selection process either looking for candidates, being on phone calls, reviewing code or giving feedback on candidates. We have managed to grow the team by approximately 12 people in 3 months! In the future I plan to publish a new post on how we have organized the teams and how the integration of all the new teammates who have joined the team has gone.

Comment your learnings and tips during your Selection processes or interviews here or contact me on my social networks for any comments, questions or suggestions so that we can all learn from each other and improve the selection processes of our sector.
