---
title: What is the best way to inject a logger?
date: 2017-03-06 16:34:00+00:00
---

I'm working on several projects right now that I'd like to be able to generate logs from.

The problem is that logging isn't required for the code to work, so how do I configure it?

I see three possibilities:

## Required in Constructor

```php
use Psr\Log\LoggerInterface;

class MyClass
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
```

**Pros**

  * Cleanest implementation

**Cons**

  * Requires user to pass in a logger even if they don't want to log anything

## Optional in Constructor

```php
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

class MyClass
{
    private $logger;

    public function __construct(LoggerInterface $logger = null)
    {
        if (is_null($logger)) {
            $logger = new NullLogger();
        }
        $this->logger = $logger;
    }
}
```

**Pros**

  * No longer requires the user to pass in a logger

**Cons**

  * Clutters up the constructor
  * I consider using null a code smell


## Optional setLogger Method

```php
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

class MyClass
{
    private $logger;

    public function __construct()
    {
        $this->logger = new NullLogger();
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
```

**Pros**

  * Clean constructor
  * No nulls

**Cons**

  * Instantiating with a logger requires two statements

## Summary

I'm leaning toward the third method for my packages even though it doesn't feel like an ideal solution. It just feels better than the other two.

How are you handling injecting an optional logger? Let me know in the comments.
