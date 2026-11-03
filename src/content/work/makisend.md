---
subtitle: Transactional email that runs on your own Cloudflare account. One API call, your own SMTP provider, every delivery logged.
role: Built at Lixali Studio. I wrote most of it, from the first feature on.
---

## The problem

An app has emails it cannot lose: a receipt, a sign-in code, a password reset. There are usually two
ways to send them. A hosted email API holds your recipients and message bodies and bills you per
email. A mail server of your own has to be kept alive, patched and watched.

MakiSend is a third way. It runs on your own Cloudflare account, with no server to look after, and it
sends through the SMTP provider you already have (Zoho, Gmail, Microsoft 365, Resend, SendGrid,
Mailgun or Cloudflare Email Service). You keep your sender domain, your reputation and your data.

## What it does

- One authenticated call, `POST /send-email`, answered with `202` at once.
- Delivery in the background, with retries and a dead-letter queue.
- A dashboard: every email and every attempt, metrics, templates, API keys, SMTP settings.
- Recipients, bodies, attachments and SMTP passwords encrypted before they are stored.

```bash
curl -X POST https://your-worker.example.com/send-email \
  -H "Authorization: Bearer mk_..." \
  -H "Idempotency-Key: order-1042-receipt" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "ada@example.com",
    "subject": "Your receipt",
    "text": "Thanks for your order 1042.",
    "html": "<p>Thanks for your order <b>1042</b>.</p>"
  }'

# 202 Accepted
# { "success": true, "message": "Email queued", "emailId": "..." }
```

## How an email travels

<figure class="flow">
<ol>
<li><strong>Your app</strong> calls <code>POST /send-email</code> with its API key.</li>
<li><strong>The Worker</strong> checks the key, validates the body with Zod, encrypts the recipient and the content, and writes a <code>pending</code> log to D1.</li>
<li><strong>The queue</strong> receives only <code>{ emailId }</code>. Your app already has its <code>202</code>.</li>
<li><strong>A Workflow</strong> starts for that email: it decrypts it, cleans the HTML and sends it over SMTP. Every step is written to the email's history.</li>
<li><strong>Your SMTP provider</strong> accepts the message and delivers it to the inbox.</li>
<li class="aside"><strong>Dead-letter queue</strong> when the error is permanent (authentication, TLS, DNS, 5xx) or after the fourth failed try.</li>
</ol>
<figcaption>One Cloudflare Worker serves the API and the dashboard. D1 holds the data, Queues and Workflows the delivery.</figcaption>
</figure>

## The decisions

### Answer first, send after

SMTP is slow, and the caller should not wait for it. So the request does the minimum (check, validate,
encrypt, store, queue) and answers `202`. The send happens right after, in a Cloudflare Workflow: a
durable run that survives a restart and remembers which step it reached. A transient failure gets
three more tries, 30 seconds apart. A permanent one stops at once: no number of retries fixes a
wrong password.

### Nothing personal in the queue

The queue carries an id and nothing else. The recipient, the body and the attachments stay in D1,
encrypted with AES-256-GCM through the Web Crypto API. The key can be rotated without downtime: an
hourly cron re-encrypts what is left under the old key and reports how much remains.

### The API key decides

The key tells MakiSend who is sending and through which SMTP configuration. Nothing in the request
body can choose either. Bodies are validated with Zod in strict mode, so an unexpected field is
refused instead of ignored.

### Never send the same email twice

A client that times out will retry, and a customer should not get two receipts. A request repeated
with the same `Idempotency-Key` gets the first response back for 24 hours, without a second send. The
same key with a different body is refused, and so is a repeat while the first is still running.
Underneath, the Workflow's instance id is the email's id, so one email cannot be started twice.

### Speak Resend's language

Attachments use the same shape as Resend's API. A client written for Resend sends the same JSON to
MakiSend and works.

## What was hard

### SMTP is the slow part

Once queued, an email reaches the provider in 300 to 400 ms at best and about 2 seconds at worst.
Most of that time is SMTP itself: each command waits for its reply (TCP, TLS, `EHLO`, `AUTH`,
`MAIL FROM`, `RCPT TO`, `DATA`), and a Worker opens a fresh connection for every email. Measuring
it told me where not to spend effort, and it is why the API answers before sending.

### Cloudflare's own email service cannot be dialled

A Worker cannot open an SMTP socket to Cloudflare Email Service. For that host, MakiSend switches to
the Worker's `send_email` binding, attachments included, and the connection check, the test send and
the daily health check follow the same path.

### No fixed IP address

Workers connect from shared Cloudflare addresses that change. A provider that only accepts known IPs
will refuse them. The fix is on the provider's side (rely on the credentials, not the address), and
the documentation says so plainly.

## Tested and shipped

The backend is a controller, service and repository per module, on Hono and Drizzle. It has unit
tests, integration tests run in Miniflare (D1, Queues and Workflows simulated locally), and an
end-to-end test that sends attachments through both entry points and compares what arrives byte for
byte.

Every pull request deploys a preview Worker with a fresh D1 database. A push to `main` runs the
migrations and deploys. Anyone can install their own copy with one button: it creates the database
and the queues on their Cloudflare account and asks only for two secrets. The first sign-in claims
the instance as its only account, and two-factor authentication is one setting away.

## Limits and what comes next

MakiSend is early. There are no webhooks, no bounce, open or click tracking, and one SMTP provider
per configuration with no automatic failover. Send quotas per API key exist but are opt-in. Those
are the next pieces.
