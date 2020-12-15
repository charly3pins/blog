+++
title = "Understanding Semantic Versioning 2.0 (SemVer)"
date = "2020-10-20"
author = "charly3pins"
description = "What semantic versioning is? Why is it important to use it in your projects as a developer? What does it mean for a user that uses your library?"

section = "/blog"
tags = ["semver", "api"]

image = "/images/semver.png"
+++
When you want to use a library in your project you probably noticed that you need to specify a version. Most of the time those versions are formatted like 3 numbers separated with dots between them. That format is indicative that the library is using the [Semantic Versioning](https://semver.org) aka SemVer. That document specifies the format and the way of labeling your projects during all the life-cycle of it. It is just a convention so you can define the version number the way you want it to be, but the truth is that other developers across all industries agreed on using it and it became a standard for versioning.

The goal of it is to have different versions of your package following the rule that each time you update the package, you update the version. With that what you  achieve is to have an unique name and version for each public package. For using SemVer you should declare a public API. That is because the versioning proposed is based on the changes against the previous version of the API, so if you don't specify one (even coded or just documented) is not possible to apply those rules.

The format of the SemVer is as mentioned before 3 numbers separated with a dot between them:
`MAJOR.MINOR.PATCH`

The way of incrementing each number is described in the document. As a summary:
- The new features with incompatible behaviour versions (breaks the API) increments the MAJOR;
- The new features backwards-compatible (does not break the API) increments the MINOR;
- The bug fixes increments the PATCH;

NOTE: The initial development uses a major version 0.
NOTE2: When the MINOR is increased the PATCH is reseted to 0; When the MAJOR is increased the MINOR and the PATCH are reset to 0.

As a special case you can use the pre-release versions. They are denoted appending a hyphen and the globally accepted following strings:
- alpha;
- beta;
- rc (release candidates);

Followed by the version number necessary. So the pre-release versions should be following a similar order like:
- 1.0.0-alpha
- 1.0.0-alpha-1
- 1.0.0-beta
- 1.0.0-beta.2
- 1.0.0-beta.10
- 1.0.0-rc.1
- 1.0.0-rc.40
- 1.0.0

NOTE: A publicly released API starts at 1.0.0.

When you want to use the SemVer you can specify an exact version or not. For that you can use the following tools:
- If you want an exact version, you indicate the dependency with: X.Y.Z;
- If you want to use the current version or greater ones even with breaking changes on the API you can use the `>` like: >X.Y.Z;
- If you want to have the current version or updated ones but with backward-compatibilities you can use the `^` like: ^X.Y.Z (where X is fixed);
- If you want to have the current version or updated ones only with bug fixes with minor-level changes you can use the `~` like: ~X.Y.Z (where X and Y are fixed);

So after reading this article as a developer using another's library you can know what type of changes they did when presenting to you the new version following the rules described above:¡. As a practical example let's see 3 package upgrades:
- New version 0.2.3 → The changes might be just bug fixes;
- New version 0.5.0 → Some functionalities added but backwards-compatible with the API;
- New version 5.0.0 → There might be a problem because it introduced breaking changes with the API;


As a conclusion the benefit of using SemVer against not:
- Clearer compatibility/dependencies;
- Encourages well-defined APIs;
- Makes upgrade decisions clearer;
