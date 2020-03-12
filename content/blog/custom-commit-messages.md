+++
title = "Custom commit messages"
date = "2020-03-10"
author = "charly3pins"
description = "Generate custom commit messages for your repo and standarize your commits log"

tags = ["terminal", "git"]

image = "/images/hugo-content-templates-managing/hugo-logo-wide.svg"
+++

I've been using the [CMF](https://github.com/walmartdigital/commit-message-formatter) tool for the last one year I think and and its simplicity is its potential. Basically it is a terminal tool developd in Go by [Walmart Digital](https://github.com/walmartdigital) that helps you to standarize the commits log of your projects.

I've been using for the last year and a half approximatley and all I can say its very useful. We agreed with the team the configuration we want to use and defined a set of changes that applies in our case. Also we choose the [Jira flow](https://github.com/walmartdigital/commit-message-formatter#jira-flow) and we changed the values for the `change` adding an emojis to make the commits a bit more funny to check them in the log.

You can install it via npm:
```terminal
npm install -g go-cmf
``` 
or from Go:
```terminal
go install github.com/walmartdigital/commit-message-formatter
```

After that, open a terminal and navigate to the root of the project you want to use it. Then type:
```terminal
cmf init 
```

You will need to select one of the flows and it will create a `.cmf.yaml` file with the template of the selected one. You can edit that file in the way you want. The unique condition is that any variable you wanna use have to be defined using `{{}}`. Example: `{{CHANGE}}` it will prompt you asking the CHANGE you did and displaying the options you defined in the template.

Here is the .cmf.yaml file that I'm using on this site:

```
PROMPT:
    - KEY: "CHANGE"
      LABEL: "Type of change"
      OPTIONS:
        - VALUE: "feat :sparkles:"
          DESC: "A new feature"
        - VALUE: "fix :bug:"
          DESC: "A bug fix"
        - VALUE: "test :rotating_light:"
          DESC: "Adding missing tests or correcting wrong ones"
        - VALUE: "style :lipstick:"
          DESC: "A code change to improve clean code"
        - VALUE: "build-ci :construction_worker_man:"
          DESC: "Changes that affect the build system and/or CI configuration files and scripts"
        - VALUE: "refactor :hammer:"
          DESC: "A code change"
        - VALUE: "docs :books:"
          DESC: "Documentation only changes"
        - VALUE: "chore :card_index:"
          DESC: "Changes that don't fit any of the options above"
    - KEY: "MESSAGE"
      LABEL: "Commit message"
TEMPLATE: "{{CHANGE}}: {{MESSAGE}}"
```