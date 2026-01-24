---
title: "How Fixing One Line of Code Improved API Performance by 97%"
excerpt: "I ran into a really interesting performance issue with my uptime monitor project today. Dashboard latency had crept up significantly due to a classic ORM trap."
category: "Engineering"
date: "2026-01-24"
readTime: "2 min read"
image: "/Posts/imgs/one-line-fix.png"
---

I ran into a really interesting performance issue with my uptime monitor project today that I thought was worth sharing.

I noticed my dashboard latency had crept up significantly, which seemed ridiculous for a simple status page. After profiling the application, the bottleneck turned out to be a classic ORM trap. I had set a relationship to use `lazy='selectin'` in my SQLAlchemy model for convenience during development.

What I didn't realize was that this configuration was forcing the application to fetch the entire history of uptime records for every single server, every time I queried the server list. As the dataset grew to hundreds of thousands of records, this became a massive hidden overhead, essentially serializing the whole database into memory on every page load.

The fix was straightforward. I removed the eager loading configuration and refactored the service layer to use a specific bulk query that fetches only the relevant 24-hour window for the dashboard. The impact was immediate and pretty dramatic, resulting in a 97% reduction in latency (dropping from 4.01s to 120ms). It was a good reminder for me that while ORM abstractions are great for velocity, we really need to keep an eye on the actual SQL they generate as our data scales.

Website URL: [https://uptime.youssef.run.place](https://uptime.youssef.run.place)
