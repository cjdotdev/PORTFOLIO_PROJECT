---
subtitle: Write LinkedIn posts ahead of time as Markdown files and let cron publish them through LinkedIn's official API. No server, no web interface.
role: My own open-source project, designed and built alone.
---

## The problem

Posting on LinkedIn regularly means being there at the right time, several times a week. I would
rather write when I have time, in my own editor, and let the posts go out on their own. Scheduling
tools exist, but they are one more account and one more subscription holding my token, for what is
really a folder of text and a clock.

So linkedin-scheduler is exactly that: a folder, two scripts and a cron line.

## What it does

- Publishes one post per run when its date and time have come, with its image card or video.
- Never publishes the same post twice, whatever goes wrong in between.
- Renders a 1080×1350 card for each post from an HTML template, code samples highlighted.
- Turns `**the hook**` into Unicode bold (LinkedIn has no markup) and puts links in a first comment.
- Checks before it sends: `--check` proves the token works, `--dry-run` shows exactly what would go out.

A post is a Markdown file named after its day:

```markdown
---
date: 2026-10-27
time: 09:00
status: ready
card_kicker: TypeScript
card_title: One rule, *written once*
card_body: Validate at runtime, type at compile time, document. With a single schema.
first_comment: The docs: https://example.com
---
**TypeScript protects you… until the data comes from outside.**
```

## How a post goes out

<figure class="flow">
<ol>
<li><strong>A post file</strong> waits in <code>posts/texts/</code>, dated, with <code>status: ready</code>.</li>
<li><strong>cron</strong> runs <code>run.sh</code> in a slot: 9:00, 9:02, 9:04, 9:06, 9:08, and the same at 13:00 and 18:00.</li>
<li><strong>publish.py</strong> takes a lock, finds the post that is due today and checks it against the ledger.</li>
<li><strong>The file is marked</strong> <code>publishing</code> before anything is sent.</li>
<li><strong>LinkedIn's API</strong> receives the card or video, then the post, then the first comment.</li>
<li><strong>The file moves</strong> to <code>posts/posted/</code> with its link, and its text goes into the ledger.</li>
<li class="aside"><strong>Left as publishing</strong> when the outcome is unknown, for me to check. Never retried.</li>
</ol>
<figcaption>Python for publishing, Node and headless Chrome for the cards. Nothing runs between two cron slots.</figcaption>
</figure>

## The decisions

### Never post twice

Posting the same text twice on a public profile is the one mistake this tool must never make. Four
guards stand in the way:

- A lock (`flock`) stops two runs from overlapping.
- The file is marked `publishing` before the request, so a crash halfway leaves a visible trace.
- Every published text is kept in `posts/ledger.json` by its SHA-256 hash. The ledger lives in git.
- A published file leaves the queue: it moves to `posts/posted/`.

### Certain failure or unknown outcome

Not all errors are equal. When the network is down or LinkedIn refuses the post, nothing went out,
so the post goes back to `ready` and the next try in the slot sends it. When the connection drops
after the request left, LinkedIn may have the post. Retrying would risk a duplicate, so the file stays
`publishing` and the log asks me to check my profile.

### Slots, not a loop

cron tries five times per slot, two minutes apart, and only inside the slots. A post missed because
my machine was off goes out at the next slot the same day. A post from a past day is never sent late:
a Monday post on Wednesday is worse than no post.

### Cards from HTML

The cards are an HTML template rendered by headless Chrome: a label, a title with accent words, a
short text, an optional logo and code sample (highlighted with Shiki), my signature. Colours and
signature live in `config.toml`. Text that does not fit is refused, not cut.

### The official API only

The tool posts through LinkedIn's own API with a token from a small LinkedIn app. Automating a social
account through its web interface goes against the platforms' terms, so there is no Reddit or X
version.

## What was hard

### Getting a token

LinkedIn gives no API key on its own. You create an app, attach it to a LinkedIn Page, add two
products and generate a token that lasts about 60 days. The setup guide walks through each click, and
the script warns a week before the token expires.

### Text that LinkedIn will not format

LinkedIn shows plain text only. Bold hooks become Unicode bold letters, links go into a first
comment posted right after, and the limits (3,000 characters, video
size and length) are checked before anything is sent.

## Tested and shipped

The publishing logic is covered by Python unit tests with a fake clock: nothing before its time, a
missed morning caught up, a past day never sent late, the same text refused, each kind of failure,
the first comment, and a dry run that sends nothing. The project ships with a website and a prompt for a
coding agent that sets everything up with you, while the LinkedIn clicks and the token stay in your
hands and nothing is published without your yes.

## Limits and what comes next

It posts to a personal profile only: company pages need LinkedIn's Community Management API review.
cron runs only when the machine is on, so certainty needs a small always-on box. And the token must
be renewed every two months, which takes a minute.

The next version is planned as a more complete npm package: the same guarantees, installed with one
command instead of a cloned folder.
