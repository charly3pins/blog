+++
title = "Collectus"
date = "2018-09-22"
author = "charly3pins"
description = "As my Final Year Project for Computer Science Engineering I builded a flexible database for collectibles and any other objects or data that any user wants to have ordered and classified in a simple and effective way."

weight = "1"

tags = ["php", "javascript", "mysql"]

image = "/images/code/collectus/main-app.jpeg"
+++
## WHY

The motivation of this project is half personal and half academic. Let me explain. At home my father always collected a lot of things, from the oldest books you can imagine until the most recent new Funko POP, through Swiss Knives or dice among others. Having that variety of objects and a lot of them (too many to be honest) cataloguing that amount of items always had been a challenge for him.

He always tried to classify in different ways such as using an Excel, free applications, paid applications, etc. At the end every time something similar happens, the handicap of his "collection of collections" (as he describes it) is too singular, and it doesn't fit anywhere. He's a developer and I was in my last year at University studying Computer Science Engineering so we started to plan how we could solve that problem by doing ourselves the application.

After a few days/weeks I realized that soon I would have to choose a project to present as my Final Year Project, so I decided to give it a try this familiar crazy idea and propose it to my tutor. She was excited about the idea we had and she accepted happily.

Once I had the approval of my tutor, it was an amazing new because the personal project we wanted to develop in our free times, now I had the opportunity to dedicate all my effort to not only solve the problem we had, but to present it as a final project. And that's how all started.

At the end the project ended up being super successful, my tutor was delighted with the result, and the court liked it a lot, they even told me to send them an email when I put it into production so they can use it and catalog their own collections.

## WHAT

I named the application Collectus as it's the Latin word meaning "gather, collect" so in that case it fits perfectly. It is a system flexible database for collectibles and any other objects or data the user wants to have ordered and classified. Collectus is thought for collectors, allowing them to keep track of any kind of collection they have, using a system database with an open structure adaptable to every need. It also provides two types of login for the users, creating a new one for the platform or using their Facebook account connecting it with the Facebook API.

![login](/images/code/collectus/login.jpeg)

Using templates the user can set all kinds of records for such diverse items as stamps or placas of cava, posters or fossils, rag dolls or lottery tickets. Once defined the template (category) for the object or type of object of interest, and the user can enter data immediately.

![item edit](/images/code/collectus/item-edit.jpeg)
![amazon mapping](/images/code/collectus/amazon-mapping.jpeg)

To facilitate all this task, it incorporates tools to help the user. The most prominent it is provided by the Amazon Product API to automatically read information from its database at the time of data entry.

![amazon search](/images/code/collectus/amazon-search.jpeg)

From here users will be able to read information according to various search criteria offered in the application and store them. There is also a price comparison between the various Amazon shops in all countries to find different prices and assist in the purchase of items to users. 

![amazon results](/images/code/collectus/amazon-results.jpeg)

All this has been developed under an attractive GUI and usability as a main goal.

Programming languages and tools used for this project:
- PHP 5, JavaScript and jQuery for the backend
- HTML and CSS for the frontend
- AJAX as the way of calling the server side
- Amazon Product API for the product research and price comparison
- Facebook API for the login

## FINAL THOUGHTS

It was my first big project as a software developer building a web and I learned a lot of things like learning new programming languages and architecture of the projects; designing the databases correctly; polish the smallest visual detail; battle with external APIs connecting to them; organize myself in order to deliver small chunks of the project step by step instead of the entire project at once; write appropriate documentation about the functionality of the project and many others probably.

I have always wanted to make a second improved version of the project, now with the experience I have and the skills that I have been acquiring throughout these years of work. I've started several times but never finished...

I hope one day to be able to officially launch the application and tell you about it here. 🚀