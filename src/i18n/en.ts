import { kojimaEn } from "./kojima";

export const en = {
  meta: {
    title: "Joel Codja, backend developer: API design and serverless edge",
    description:
      "Joel Codja is a backend developer from Gabon, based in Cotonou, focused on API design and serverless edge architectures. He builds MakiSend and linkedin-scheduler.",
    projectsTitle: "Projects, Joel Codja",
    projectsDescription:
      "MakiSend and linkedin-scheduler, shipped, and Supasecret and Voctra, under way: the projects of Joel Codja.",
    blogTitle: "Writing, Joel Codja",
    blogDescription: "Articles by Joel Codja on backend engineering: API design, serverless at the edge, and what building real systems teaches.",
    musicTitle: "The deck, Joel Codja",
    musicDescription: "Eleven songs Joel Codja plays while he codes, each one spinning on its own CD.",
    picsTitle: "Pics, Joel Codja",
    picsDescription: "Photos by Joel Codja: skylines, sunsets and light, in a grid.",
    kojimaTitle: "Satoshi Kojima, a story by Joel Codja",
    kojimaDescription:
      "The career of Satoshi Kojima told in five chapters: from loading trucks outside the NJPW dojo to all three heavyweight crowns of Japanese wrestling.",
    notFoundTitle: "Page not found, Joel Codja",
    siteName: "Joel Codja",
  },
  nav: {
    label: "Main",
    skip: "Skip to content",
    home: "Joel Codja, home",
    work: "Projects",
    writing: "Writing",
    pics: "Pics",
    contact: "Contact",
    language: "Language",
    switchTo: "Lire en français",
    switchShort: "FR",
    menu: "Menu",
    backHome: "Home",
  },
  intro: {
    skip: "Skip intro",
  },
  hero: {
    // The headline is the job and the specialty (the studio has its own row further down); the line
    // under it says where Joel comes from.
    // One sentence in two sizes: the job large, the specialty under it. [Brackets] mark the two
    // specialties, set in terracotta.
    role: "Backend developer,",
    specialty: "focused on [API design] and [serverless edge architectures].",
    line: "From {country}, based in Cotonou.",
    primary: "Email me",
    secondary: "Download my CV",
    say: "say ko-ja",
    portraitAlt: "Ink engraving of Joel Codja among palm trees",
    portraitPhoto: "Show the photo the engraving was drawn from",
  },
  work: {
    title: "My projects",
    all: "All projects",
    stack: "Stack",
    more: "See more",
    less: "See less",
    repo: "Source code",
    site: "Visit site",
    delivered: "Shipped",
    building: "In progress",
    planned: "Coming up",
    due: "Planned for",
    hint: "Use the arrows to go through the projects. Click the card to play its demo.",
    hintSwipe: "Swipe to go through the cards. Tap one to play its demo.",
    draw: "Draw the card",
    previous: "Previous project",
    next: "Next project",
    deck: "Deck of projects",
    items: {
      makisend: {
        name: "MakiSend",
        line: "Open-source transactional email that runs on your own Cloudflare account.",
        role: "I build it at Lixali Studio.",
        facts: [
          "Your app gets a 202 at once. A Workflow sends the email, retries it and logs the result.",
          "300 to 400 ms per send at best, about 2 s at worst. SMTP takes most of it.",
          "Three retries 30 s apart, then a dead-letter queue for hard failures.",
          "Credentials, recipients and bodies are AES-256 encrypted at rest in D1.",
        ],
        shotAlt: "The MakiSend dashboard listing sent emails with their status",
      },
      "linkedin-scheduler": {
        name: "linkedin-scheduler",
        line: "Write LinkedIn posts in advance as Markdown files and let cron publish them through LinkedIn's official API.",
        role: "My open-source project.",
        facts: [
          "No server and no web interface: a folder, two scripts and a cron line.",
          "Never posts twice: a ledger, a publishing state and a lock between runs.",
          "Renders 1080×1350 post cards from an HTML template, code samples highlighted.",
          "Checks before sending: --check proves the token, --dry-run shows what would go out.",
        ],
        shotAlt: "The linkedin-scheduler website: your LinkedIn posts, written ahead, published on time",
      },
      contrasto: {
        name: "Contrasto",
        line: "Checks colour pairs against the WCAG AA and AAA contrast thresholds as you type.",
        role: "Side project.",
        facts: [] as string[],
        shotAlt: "Contrasto comparing a text colour with its background",
      },
      zeroknowledge: {
        name: "Supasecret",
        line: "A 1time.io-style web app to share secrets through one-time links, encrypted in the browser so the server never reads them.",
        role: "My own project, under way.",
        facts: [] as string[],
        shotAlt: "",
      },
      pulse: {
        name: "Voctra",
        line: "A Thunder Client-style VS Code extension to send HTTP requests, read responses and save them in collections, without leaving the editor.",
        role: "My own project, under way.",
        facts: [] as string[],
        shotAlt: "",
      },
    },
  },
  // The three phases of what Joel does for a client (build, take over, connect), told one by one as the page scrolls (AboutStory.astro).
  // Each title is the verb (in terracotta) and the rest of its clause.
  story: {
    label: "What I do for you, in three phases",
    gets: "What you get",
    phases: [
      {
        id: "build",
        verb: "Build",
        rest: "your backend from scratch",
        lead: "You have an idea, a product or an app, and nothing behind it yet.",
        body: "I model your data, build the API your apps talk to, and set up the work that runs in the background: emails, payments, scheduled tasks. It goes live tested and documented from day one.",
        gets: [
          "A data model that fits your business",
          "A documented API your apps can rely on",
          "A backend in production, tested and documented",
        ],
        alt: "Engraving: a hand comes out of a cloud and sets a compass on a block of stone, under a ribbon reading Labore et Constantia",
      },
      {
        id: "takeover",
        verb: "Take over",
        rest: "a backend that is slow, fragile or undocumented",
        lead: "It works, mostly. But nobody dares to touch it, and the person who built it has left.",
        body: "I map how it really works and write it down, then fix what hurts first, slow queries, hidden errors, missing tests, without stopping what runs. Your team can ship again without fear.",
        gets: [
          "A map and documentation of what exists",
          "The worst problems fixed first, without downtime",
          "A backend your team can change safely",
        ],
        alt: "Engraving: a hand firmly grips a cord",
      },
      {
        id: "connect",
        verb: "Connect",
        rest: "what you have to payments, email and outside APIs",
        lead: "Your product works, but it has to talk to the rest of the world.",
        body: "Payments, emails, a CRM, another platform: I wire them in with webhooks, retries and logs, so a failure on their side never becomes a lost order on yours.",
        gets: [
          "Payments, email and third-party APIs wired in",
          "Retries when an outside service fails",
          "Logs that show what happened, and when",
        ],
        alt: "Engraving: two hands clasped in a handshake",
      },
    ],
  },
  stack: {
    title: "The tools I use",
    groups: { languages: "Languages", apis: "APIs", cloud: "Cloud and data", quality: "Quality and delivery" },
  },
  about: {
    title: "What I can do for you",
  },
  experience: {
    // Closes "What I can do for you": where Joel does all of it today.
    title: "Where I do this today",
    present: "now",
    items: {
      lixali: {
        role: "Backend developer",
        desc: "Developer-facing APIs, event-driven systems and serverless infrastructure deployed at the edge.",
      },
    },
  },
  writing: {
    title: "Writing",
    lede: "Notes from building things.",
    all: "All posts",
    empty: "No posts yet. New ones appear here as I publish them.",
    /** Marks a post shown in the other language (it has no English version). */
    otherLanguage: "In French",
    filters: "Filter by topic",
    allTopics: "All",
  },
  projectsPage: {
    title: "Projects",
    lede: "What I have built and what I am building, with what each one does and how.",
  },
  blogPage: {
    title: "Writing",
  },
  notFound: {
    title: "This page doesn't exist.",
    lede: "The link may be old, or the address mistyped. Everything else is still here.",
    home: "Back home",
  },
  post: {
    back: "All posts",
    minRead: "min read",
    updated: "Updated",
    contents: "On this page",
    onlyIn: "This post only exists in French.",
    copyCode: "Copy",
    copiedCode: "Copied",
    headingLink: "Link to this section",
    share: "Share",
    copyLink: "Copy link",
    copiedLink: "Link copied",
    writtenBy: "Written by",
    bio: "Backend developer from Gabon, based in Cotonou. I design APIs and build serverless systems at the edge.",
    previous: "Previous post",
    next: "Next post",
  },
  contact: {
    title: "Let's talk",
    lede: "Hiring for a backend role, a project to build or take over, or just saying hello? Send a request to my inbox, or write to me directly.",
    // The form is an API request: keys, method and statuses stay in English in both languages (they
    // are code); the // comments and the placeholders are the language of the page.
    request: {
      label: "Send a message",
      comment: "a message, straight to my inbox",
      subject: "What is it about?",
      subjects: { hire: "a backend role", project: "a project to build, take over or connect", hello: "just saying hello" },
      namePlaceholder: "Ada Lovelace",
      emailPlaceholder: "you@company.com",
      messagePlaceholder: "What are you working on?",
      submit: "Send request",
      sending: "Sending",
      sent: "received",
      sentComment: "I reply within two days.",
      failed: "Your message did not leave. Write to me at {email}.",
      again: "Send another",
      engravingAlt: "Engraving: Mercury, messenger of the gods, flies on a cloud and holds up a letter",
    },
  },
  footer: {
    elsewhere: "Elsewhere",
    rights: "© 2026 Joel CODJA",
    top: "Back to top",
  },
  musicPage: {
    title: "The deck",
    lede: "Eleven songs I play while I code. Pick one to put it on.",
    playlist: "Playlist",
    play: "Play",
    pause: "Pause",
    prev: "Previous song",
    next: "Next song",
    loading: "Loading the disc",
    ready: "On the platter. Press play.",
    playing: "Now playing",
    listen: "Listen on Apple Music",
    note: "30-second previews from Apple Music. Album artwork © the artists and their labels.",
    back: "Back to home",
    backHref: "/#off-the-clock",
    scene: "The CD of the song playing, spinning, with a ring around it that fills as the song goes on.",
  },
  kojima: kojimaEn,
  picsPage: {
    title: "Pics",
    lede: "I'm a huge fan of photography.",
    note: "An account of the photos I take, added to as I go.",
    back: "Back to home",
    backHref: "/",
  },
};

export type Dict = typeof en;
