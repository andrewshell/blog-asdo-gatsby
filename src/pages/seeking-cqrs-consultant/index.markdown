---
author: andrewshell
comments: false
date: 2017-11-09 18:32:25+00:00
layout: page
link: https://blog.andrewshell.org/seeking-cqrs-consultant/
slug: seeking-cqrs-consultant
title: Seeking CQRS Consultant
wordpress_id: 735
---

At my day job, we're in the process of building version 2 of our flagship product. We have what I think is a good system in place using the [CQRS](https://martinfowler.com/bliki/CQRS.html) pattern.
We have an API that exposes a number of services.  Read-only services have access to read from the database. Services that write, create a command that is placed on a queue for a worker on a different server to execute.
This is the first time my team has implemented a system like this so a lot of this we're figuring out as we go along. We've run into issues around how to implement command listeners that can be executed out of order as well as how to implement validation in the service so we can catch and report errors to the API consumer before we go and send off the command.
I'm hoping to find someone who has successfully built and operated a system architected in this way. Someone who can look at what we're doing and point out pitfalls in how we're doing things. Basically, I don't know what I don't know.
Ideally, this person is familiar with PHP and if possible within driving distance of Madison, WI.  We're not opposed to flying someone out here or working with someone remotely, however, if there is someone local that would be awesome.
If you or someone you know seems to fit this description, please [contact me here](https://www.futureproofphp.com/contact/).
