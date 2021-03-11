+++
title = "How to add Google Analytics to your Hugo site"
date = "2020-11-23"
author = "charly3pins"
description = "Quick tutorial how to integrate Google Analytics in a Hugo website."

tags = ["hugo", "cms"]

image = "/images/google-analytics-hugo.png"
+++
## Google Analytics

First of all what you need is to obtain a Google Analytics tracking ID. For that you need to sign up at [Google Analytics](https://analytics.google.com/analytics/web/). Then, you need to create a tracking ID following the next steps:

- Click on `Admin` button (on the bottom left corner).
- Click on `Create Account` button.
- After all the steps filled, click the `Create` button and accept the terms and conditions.

After the completion of these steps you will obtain your tracking ID. Copy it for add to your Hugo site later.

## Hugo configuration

Now it's turn to add the tracking ID to your site.
The easiest way for do it is using the Hugo's [internal template](https://gohugo.io/templates/internal/#google-analytics) provided by Hugo. You just need to add a new variable called `googleAnalytics` with the `tracking ID` obtained from the previous step in your `config.toml` like:
```vim
googleAnalytics = "UA-123-45"
```

The next step is to add the following snippet of code in your site:
```vim
{{ template "_internal/google_analytics.html" . }}
```
You should search for the `head` partial template and add it inside the `<head></head>` tags.

## Checking the integration

Before passing that to production you can test it running your site locally performing the next command:
```vim
hugo serve
```

The default url on localhost is `http://localhost:1313`.

Open again or refresh [Google Analytics](https://analytics.google.com/analytics/web/) on a different tab. 

Check the dashboard and you should be able to see the number under the section Active Users right now as 1 like the picture below:
![active-users](/images/google-analytics-active-users.png)