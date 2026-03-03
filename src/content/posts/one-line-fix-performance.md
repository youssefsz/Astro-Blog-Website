---
title: "Eliminating the N+1 Problem: A 97% Performance Improvement in SQLAlchemy"
excerpt: "A case study on how a single line of configuration in SQLAlchemy caused a massive performance bottleneck and how understanding loading strategies fixed it."
category: "Engineering"
date: "2026-01-24"
readTime: "4 min read"
image: "../../assets/Posts/imgs/one-line-fix.png"
---

Performance bottlenecks in modern web applications often hide in plain sight, masked by the convenience of Object Relational Mappers (ORMs). I recently encountered a severe latency issue in my uptime monitor project where a simple dashboard page load had degraded to over 4 seconds.

After profiling the application, the culprit was identified as the classic [N+1 Select Problem](https://sgoel.dev/posts/handling-the-n-1-selects-problem-in-sqlalchemy/). This occurs when an application executes a separate database query for each object in a collection, rather than fetching them all in a single batch.

### The Root Cause

I had configured a relationship in my SQLAlchemy model using `lazy='selectin'` for convenience during early development.

```python
# The problematic configuration
servers = relationship("Server", lazy="selectin", ...)
```

What I failed to account for was the scale of the related data. This configuration forced the application to fetch the entire history of uptime records for every single server whenever the server list was queried. As the dataset grew to hundreds of thousands of records, this effectively serialized the entire database into memory on every request.

### The Solution

The fix involved two steps:
1. Removing the eager loading configuration to prevent automatic fetching of heavy relationships.
2. Refactoring the service layer to use an explicit bulk query that fetches only the relevant 24 hour window needed for the dashboard.

This shift from implicit eager loading to explicit data fetching resulted in a dramatic performance improvement. The dashboard latency dropped from **4.01s** to **120ms**, a **97% reduction**.

### Lessons Learned

ORMs like SQLAlchemy are powerful tools, but they require a deep understanding of their [loading strategies](https://medium.com/@dresraceran/understanding-sqlalchemys-eager-loading-joinedload-selectinload-and-contains-eager-e12d98c8c8b0). While abstractions increase velocity, they should not replace a solid understanding of the underlying SQL execution plans. Always verify the generated queries as your data scales.

Website URL: [https://uptime.youssef.run.place](https://uptime.youssef.run.place)
