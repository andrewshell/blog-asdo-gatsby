---
title: Instant Outliner with self-hosted nodeStorage
date: 2020-10-24 17:09:57+0000
---

As it stands, it doesn't work. I updated my nodeStorage server to make sure web sockets were turned out. Looks like the config.json template I used doesn't include a WebSocket port variable which is required to turn on web sockets. My nodeStorage server now has this enabled.

I went ahead and tried my best to make a detailed error report and published it <a href="https://gist.github.com/andrewshell/6d554d5fd993e48d8cac8125c0e297f3">here</a>.

This will need to be resolved before anyone can subscribe to my status outline and get updates.

