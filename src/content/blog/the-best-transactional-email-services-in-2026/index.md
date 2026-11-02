---
title: "The best transactional email services in 2026"
subtitle: "Password resets, receipts and sign-in codes have to arrive. Here are seven ways to send them from your app, starting with the one that keeps your data and your provider in your hands."
date: 2026-10-23
tags: ["Tools"]
cover: ./cover.webp
coverAlt: "The MakiSend logo in the centre, linked by dotted lines to the logos of Resend, SendGrid, Mailgun, Postmark, Amazon SES and Brevo"
draft: false
---

Almost every application sends email. A user signs up and needs to confirm their address. Someone forgets their password. A customer pays and expects a receipt. These messages are not marketing: they are part of the product, and if they do not arrive, the product feels broken.

Sending them yourself, from your own mail server, is rarely a good idea. Deliverability, retries, logs and security quickly become a project of their own. This is why most teams rely on a transactional email service.

In this article, we will look at what makes a good transactional email service, then compare seven options: MakiSend, Resend, Postmark, Amazon SES, SendGrid, Mailgun and Brevo. Full disclosure: I built MakiSend, so it comes first. I will still be honest about where each tool shines, MakiSend included.

## What is transactional email?

**Transactional email** is a message sent automatically to one person, in response to something that person did.

Common examples include:

- Account confirmation and email verification
- Password reset links
- Sign-in codes and two-factor authentication
- Receipts, invoices and order confirmations
- Notifications about account activity

### Transactional vs. marketing email

| Feature | Transactional Email | Marketing Email |
| --- | --- | --- |
| Trigger | An action of the user | A campaign decided by the business |
| Recipients | One person | A list of contacts |
| Expected by the user | Yes, often immediately | Not necessarily |
| Consent | Part of the service | Requires opt-in in most countries |

Transactional emails are expected, and often urgent. A sign-in code that arrives ten minutes late is a sign-in that failed.

## What to look for

Before comparing services, it helps to know what matters for this kind of email.

### Deliverability

The email must reach the inbox, not the spam folder. This depends on the sending infrastructure, its reputation, and a correct setup of SPF, DKIM and DMARC on your domain.

### A simple API

Sending an email should be one HTTP request, with clear errors when something is wrong.

### Reliability

A provider can be slow or unavailable for a moment. A good setup retries automatically instead of losing the message.

### Visibility

When a user says "I never received the email", you need logs that show what happened, and long enough to check.

### Data privacy

Transactional emails contain sensitive information: addresses, names, reset links, sometimes invoices. Where this data is stored, and in what form, matters.

### Price

Most services charge per email or per monthly volume. The free tier is often what decides the choice for a small project.

## The seven best transactional email services

### 1. MakiSend

[MakiSend](https://makisend.lixalistudio.tech) is a self-hosted, serverless email API that runs on **Cloudflare Workers**. Your application sends one authenticated request; MakiSend encrypts and queues the message, then delivers it through **your own SMTP provider**, with automatic retries and a dashboard that shows every delivery.

It takes a different approach from the other services in this list. Instead of replacing your email provider, MakiSend sits in front of it: you keep your provider, your sender domain and your reputation, and you get one API, one dashboard and the same guarantees whatever provider is behind it.

#### Why choose MakiSend

- **No server to run.** One Worker serves both the API and the dashboard. Cloudflare Queues and Workflows handle delivery.
- **Bring your own SMTP.** Zoho, Gmail, Microsoft 365, Resend, SendGrid, Mailgun or Cloudflare Email Service. Changing provider does not change your code.
- **Reliable delivery.** The API answers `202` immediately, then a durable workflow sends the email with bounded retries and a dead-letter queue.
- **Private by default.** Recipients, bodies, attachments and SMTP credentials are encrypted with AES-256-GCM before they are stored.
- **Built for small teams.** Per-user API keys with optional quotas, idempotency keys, two-factor authentication, and a dashboard with logs, metrics and templates.
- **A familiar API.** Attachments use the same format as Resend, so a client written for Resend sends the same JSON.

#### Sending an email

```bash
curl -X POST https://your-instance.workers.dev/send-email \
  -H "Authorization: Bearer mk_your_api_key" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: order-1042-receipt" \
  -d '{
    "to": "customer@example.com",
    "subject": "Your receipt",
    "text": "Thank you for your order #1042.",
    "html": "<p>Thank you for your order <strong>#1042</strong>.</p>"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Email queued",
  "emailId": "..."
}
```

The `Idempotency-Key` header makes the request safe to retry: sending the same key twice returns the original email instead of sending a second one.

#### Limits

MakiSend is young. Webhooks and bounce, open and click tracking are not built yet, and deliverability depends on the SMTP provider you connect. Workers also send from shared Cloudflare IPs, so a provider that requires IP allow-listing will not work.

#### Price

MakiSend is free. You pay Cloudflare for the Worker, D1 and Queues you use, and your SMTP provider for the email it sends. Nothing is charged per email on top.

### 2. Resend

[Resend](https://resend.com) is a developer-focused email API with a clean interface, SDKs for most languages, and first-class support for React Email templates.

**Strengths:** an excellent developer experience, clear documentation, and webhooks for delivery events.

**Limits:** logs are kept for 30 days on every plan except Enterprise, and the free plan is capped at 100 emails per day.

**Price:** free for 3,000 emails per month (100 per day). Pro starts at $20 per month for 50,000 emails.

Resend also works as the SMTP provider behind MakiSend.

### 3. Postmark

[Postmark](https://postmarkapp.com) focuses on transactional email only, and is known for its fast delivery and its strict separation between transactional and broadcast traffic.

**Strengths:** a strong reputation for deliverability, message retention of 45 days, extendable on higher plans.

**Limits:** the free plan is only meant for testing, at 100 emails per month, and the first paid plan starts at 10,000 emails.

**Price:** Basic starts at $15 per month for 10,000 emails, then $1.80 per 1,000 extra emails.

### 4. Amazon SES

[Amazon Simple Email Service](https://aws.amazon.com/ses/) is the low-level option: very cheap at scale, but bare.

**Strengths:** the lowest price per email in this list, and the scale of AWS.

**Limits:** new accounts start in a sandbox and must request production access, the console is complex, and logs, retries and templates are mostly up to you.

**Price:** $0.10 per 1,000 emails, plus $0.12 per GB of attachments. New AWS customers receive credits that can be used on SES.

### 5. SendGrid

[SendGrid](https://sendgrid.com), owned by Twilio, is one of the oldest and most widely used email platforms, covering both transactional and marketing email.

**Strengths:** a mature platform, a large ecosystem, and integrations almost everywhere.

**Limits:** there is no permanent free plan anymore, only a 60-day trial, and activity history is kept for 3 days on Essentials.

**Price:** a free trial of 60 days at 100 emails per day. Essentials starts at $19.95 per month.

SendGrid also works as the SMTP provider behind MakiSend.

### 6. Mailgun

[Mailgun](https://www.mailgun.com) is an email API built for developers, with sending, receiving and validation features.

**Strengths:** a complete API, inbound email routing, and solid documentation.

**Limits:** logs are kept for only 1 day on the free and Basic plans.

**Price:** free for 100 emails per day. Basic starts at $15 per month for 10,000 emails.

Mailgun also works as the SMTP provider behind MakiSend.

### 7. Brevo

[Brevo](https://www.brevo.com), formerly Sendinblue, is a marketing platform that also offers transactional email through an API and SMTP.

**Strengths:** a generous free plan, transactional email included on every plan, and marketing tools in the same place.

**Limits:** the product is built around marketing first, so the transactional side is one feature among many.

**Price:** free for 300 emails per day. Paid plans are priced by monthly volume.

## Comparison

Prices as published by each service at the time of writing.

| Service | Free tier | Paid from | Hosting | Your data |
| --- | --- | --- | --- | --- |
| **MakiSend** | Free, no per-email fee | Your Cloudflare and SMTP usage | Your Cloudflare account | Encrypted with AES-256-GCM, in your own database |
| Resend | 3,000 emails/month (100/day) | $20/month | Resend | On Resend's servers |
| Postmark | 100 emails/month | $15/month | Postmark | On Postmark's servers |
| Amazon SES | AWS credits for new accounts | $0.10 per 1,000 emails | AWS | In your AWS account |
| SendGrid | 60-day trial (100/day) | $19.95/month | Twilio | On Twilio's servers |
| Mailgun | 100 emails/day | $15/month | Mailgun | On Mailgun's servers |
| Brevo | 300 emails/day | Volume-based | Brevo | On Brevo's servers |

## How to choose

**Choose MakiSend** if you want to own your email pipeline without running a server: your data stays encrypted in your own Cloudflare account, you keep the SMTP provider you already pay for, and you get retries, logs, templates and API keys without a monthly subscription. It is the natural choice for indie developers, small teams and anyone already on Cloudflare.

**Choose Resend** if you want a hosted service with the best developer experience and do not mind your data living on their side.

**Choose Postmark** if deliverability is your only concern and you send enough volume to justify a paid plan from the start.

**Choose Amazon SES** if you send very large volumes, already live in AWS, and are ready to build logs and retries yourself.

**Choose SendGrid, Mailgun or Brevo** if you also need marketing campaigns or inbound email from the same provider.

Remember that these choices are not exclusive. With MakiSend, Resend, SendGrid or Mailgun can be the provider behind your API, and switching from one to another is a change of SMTP settings, not of code.

## Conclusion

Transactional email looks simple until a reset link goes missing. A good service has to deliver reliably, retry when a provider fails, keep logs long enough to answer support questions, and protect the personal data these messages carry.

In this article, we looked at what transactional email is, the criteria that matter when choosing a service, and seven options with their strengths, limits and prices.

Hosted services such as Resend, Postmark, SendGrid, Mailgun and Brevo are quick to start with, and Amazon SES is hard to beat on price at scale. MakiSend takes another path:

- Running on your own Cloudflare account, with no server to manage
- Keeping your SMTP provider, your domain and your reputation
- Encrypting recipients, content and credentials before storing them
- Charging nothing per email

The best transactional email service is the one your users never think about, because every email simply arrives.

If you want to try MakiSend, the code and the one-click deployment are on [GitHub](https://github.com/lixalistudio-oss/makisend), and the documentation is on [makisend.lixalistudio.tech](https://makisend.lixalistudio.tech).
