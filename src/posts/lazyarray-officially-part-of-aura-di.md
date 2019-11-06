---
author: andrewshell
comments: true
date: 2016-10-04 18:37:55+00:00
excerpt: My LazyArray feature has been officially added to Aura.DI.
layout: post
slug: lazyarray-officially-part-of-aura-di
title: LazyArray Officially Part of Aura.Di
wordpress_id: 723
categories:
- PHP
---

In my prior posts about integrating [Symfony Forms with Radar](https://www.futureproofphp.com/2016/09/26/symfony-forms-radar/), I created a helper class called [LazyArray](https://github.com/futureproofphp/symfony-forms-radar/blob/1.x/src/LazyArray.php).

It was designed so I could pass an array of lazily instantiated objects into a setter like Twigs `setExtensions` method.

Paul liked my implementation and asked me to submit a PR.

Today it was merged and included in [Aura.Di 3.2.0](https://github.com/auraphp/Aura.Di/releases/tag/3.2.0) which makes me very excited.
