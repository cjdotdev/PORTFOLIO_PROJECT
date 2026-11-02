---
# Sample post, published for now so Joel can see it deployed (2026-11-02): set draft: true again, or
# delete the folder, once his real posts are in.
title: "Making webhooks idempotent on Cloudflare Workers"
subtitle: "Providers retry. Your handler runs twice. Here is how to make the second run do nothing, with one KV key per event."
date: 2026-11-02
tags: ["Cloudflare", "Webhooks", "TypeScript"]
cover: ./cover.webp
coverAlt: "An engraved hand coming out of a cloud, holding a compass over the world"
draft: false
---

A payment provider calls your webhook. Your handler times out after it has written to the database,
the provider gets no answer, and it sends the same event again a minute later. Now the customer has
two orders.

## Why the same event arrives twice

Every serious provider retries until it gets a `2xx`. That is a feature: it means you never lose an
event. It also means your handler must accept the same event more than once.

### What counts as the same event

Providers send an id with each event. Two deliveries with the same id are the same event, even if
their timestamps differ.

## One key per event

Before doing any work, record the event id. If it is already there, answer `200` and stop.

```ts
import { Hono } from "hono";

type Env = { EVENTS: KVNamespace };
const app = new Hono<{ Bindings: Env }>();

app.post("/webhooks/payments", async (c) => {
  const event = await c.req.json<{ id: string; type: string }>();
  const key = `event:${event.id}`;

  if (await c.env.EVENTS.get(key)) return c.body(null, 200);
  await c.env.EVENTS.put(key, "1", { expirationTtl: 60 * 60 * 24 * 7 });

  // ...handle the event once
  return c.body(null, 200);
});

export default app;
```

```bash
pnpm wrangler kv namespace create EVENTS
pnpm wrangler deploy
```

> KV is eventually consistent: two deliveries a few milliseconds apart can both pass the check. When
> that matters, use a Durable Object or a unique constraint in your database.

![Two engraved hands shaking](./handshake.webp)

## What to answer

| Situation                 | Answer | Why                          |
| ------------------------- | ------ | ---------------------------- |
| New event, handled        | 200    | The provider stops retrying  |
| Event already seen        | 200    | Nothing left to do           |
| Bad signature             | 401    | Not from the provider        |
| Your database is down     | 503    | Let the provider retry later |

---

Record first, work second, and a retry becomes harmless.
