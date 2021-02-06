+++
title = "Hugo's content and templates managing"
date = "2020-03-08"
author = "charly3pins"
description = "How to organize your content and create your templates to get maximum value from Hugo."

tags = ["hugo", "cms"]
category = "technology"

image = "/images/gohugoio-card.png"
+++

After long time without writing... I'm back!

![I'm back](/images/hugo-content-templates-managing/im-back-terminator.jpg)

I was planning to rebuild my site and start creating content again but never found the time until now.

I wanted to do my theme from scratch instead of using a predefined [theme](https://themes.gohugo.io/), so I had to learn how the templating and the content managing is done in Hugo.

Once I did that process, I want to sum up the most important things that I consider you have to know if you wanna do your own theme like I did (this site is the prove of that!).

## Content management

First of all let's talk about the [content organization](https://gohugo.io/content-management/organization/) in Hugo.

All the content you wanna have in your site have to be inside the `content/` directory. You simply put your posts inside `content/posts` and your description in `content/about` and Hugo will do the magic for you. Sounds easy right? Continue then.

Hugo has mainly two types of pages, the "unique" and the "multi" ones. The first ones are used for example for an `about` or for a `faq` or a `contribute` or a `landing`... The second ones are used when you want to group under a same category different content. For example your different publications for your `posts` or a catalogue for your `products`. Being said that, there is another difference that you have to know when you create your different pages.

The unique ones have to be named like `index.md`, the list ones don't. This at the end indicates to Hugo how to manage the content inside the directories and how to generate the URLs to access them. The following schema demonstrates how that works:

```
└── content
    └── about
    |   └── index.md        (https://mysite.com/about)
    ├── posts
    |   ├── first-post.md   (https://mysite.com/posts/first-post)
    |   └── second-post.md  (https://mysite.com/posts/second-post)
    |   └── trips
    |       └── pandora.md  (https://mysite.com/posts/trips/pandora)
    └── faq
        └── index.md        (https://mysite.com/faq)
```

Also there is a possibility to specify the URL using the property `slug` like slug="my-custom-url".

## Templates management

Now you know how to organize your content, it's time to talk about the [templates](https://gohugo.io/templates/). They are the HTML code that generates the pages of your site. There are a few tricks and tips that I want to share with you like I did with the content on the previous section.

The different templates have to be placed inside the `layouts/` directory. On the root must be the main template called `index.html` used to render the homepage. Same way as the content, the templates can be organized in folders if you want to display in different ways the content depending on the route. Like the content, the templates can be organized between unique and multi. Taking the content organization described before, considering that you want to specify different templates for each content folder, one of the possible template organization can be:

```
└── layouts
    └── _default_
    |   ├── list.html
    |   └── single.html
    └── posts
        ├── list.html
        └── single.html
        └── trips
            ├── list.html
            └── single.html
```

Analyzing in detail, you can see a similar tree like the content but with a particularity that no `about` and no `faq` folders but it appeared a `_default` one. This special folder is used by Hugo to render the pages that doesn't have their own template. On that case the about and the faq, both unique types, will be rendered using the `layouts/_default/single.html` template. If the `trips` directory didn't exist, the templates used will be the `_default` ones.

At this point you know about content organization and template managing, but you are thinking:
> How Hugo know when I want to use a single or a list page?

The answer is depending on the URL and the content there. Using again the example above for the content organization, if you notice the `about` contains a `index.md` so that indicates Hugo is a "unique" page. As we didn't defined any particular template for that, the one that will be used is the generic `_default/single.thml`. 

On the other hand, inside the `posts` there are three posts but no `index.md` one, so that indicates Hugo that it's a "multi" page, so you will use both templates, the `list.html` one like an "index" of your posts, and the `single.html` for each post. To render the `list.html` one you have to go to the URL of the directory (https://mysite.com/posts/). For the posts (https://mysite.com/posts/first-post) and (https://mysite.com/posts/second-post) the template used will be `single.html`.

### Page variables

The Pages have a set of useful variables that are good to know:
- Title: the title of the post
- Description: a short/long description of the post
- Content: the body of the post
- ReadingTime: the mins that Hugo autocalculates will take to read the post

For accessing to the custom parameters that you can create on each post you should access them by name inside the `Params` object (Params.yourParam).

You can display a related posts reading the results of the `.Site.RegularPages.Related`.

See the full list on the [documentation](https://gohugo.io/variables/page/) page.

The `list.html` template is used to display a short description of the posts like a book index with the links to the actual post. For doing that, you have to access to the `$.Paginator.Pages` variable and loop over the results. The variables are the same described above with a one more `Permalink`, the one you need to use for access the post (and call the `single.html` template) for that content.

Also there are the `PrevInSection` and `NextInSection` variables for paginate the results.

### Partial templates

The last tip I want to explain you is that you don't need to repeat all time all the parts of the templates, you can extract the common part in a template and then reuse it anywhere you want. These are the [partial templates](https://gohugo.io/templates/partials/). Its particularity is you need to place that part inside a `partials/` directory and call it like `{{ partial "name.html" . }}`. They are useful for the `header`, `footer`, `navbar` and other generic parts as well as for a list template that you wanna reuse for your posts and for your trips for example.
