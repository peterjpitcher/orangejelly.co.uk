# Article 1 spec: AI in hospitality

**For:** BII News · **Print:** 500 to 550 words, plus a version of 300 words at most · **Guide:** `/guides/ai-for-pubs` · **Short link:** `orangejelly.co.uk/pub-ai`

Read `README.md` in this folder first. Its rules are part of this spec, and its section numbers are used below.

Two things make this piece harder than it looks. AI products change every month, so a menu name that was right when this spec was written may be wrong when you write. And BII News has already run two features about AI with Peter in them, so anything obvious has been said. Stay inside the fact bank, and check it again on the day.

---

## 1. The brief

**Reader.** A licensee who has probably tried ChatGPT once or twice, and is not technical.

**What BII News has already run.** A six-page AI special report in summer 2025 (getting started with ChatGPT, forecasting, HR, an interview with Peter) and a two-page feature with Peter in spring 2026 (an AI-built website, bookings, adverts). Social posts, posters, forecasting and "getting started" are covered.

**What it has not run, and this piece supplies.**

- What has changed: guests now use AI to choose where to go, and Google's AI links them straight to a booking.
- The shortcuts: what `/`, `@` and `#` really do, and which "secret codes" are not real.
- The rules: what never goes into an AI tool, and who checks what comes out.

**The line that holds it together.** Start with a job, not a tool. It is Peter's own line: BII News quoted him in spring 2026 saying the biggest mistake pubs make with technology is starting with tools and not outcomes.

**The one thing the reader should do.** Scan the code for the prompts, the shortcut sheet and the one-page policy.

**What it must not do.**

- It must not repeat Peter's 2025 print piece `docs/charlotte/simple-ai-for-busy-pubs.md` (ten prompts and a daily routine). Do not copy from it.
- It must not predict anything. In 2025 Peter told BII News that agents would matter "within a year". Do not comment on that and do not make a new forecast.
- It must not quote a price for any software.
- It must not mention a feature that has been withdrawn (section 9).
- It must not use any figure from the earlier BII News pieces about The Anchor.

## 2. What you produce

| File | What it is |
|---|---|
| `content/blog/ai-for-pubs.md` | The guide |
| `marketing/bii-ai-2026/print-copy.md` | The print copy: two article blocks (long, then short) and one furniture block |
| `marketing/bii-ai-2026/bii-ai-2026-qr.svg` and `.png` | The QR code |
| `marketing/bii-ai-2026/README.md` | The handover note |
| The repo edits in section 7 of this spec | Mapping, short link and tests |

## 3. The fact bank

These are the only facts you may use. The source code points to section 4.

Everything in 3.2 describes software as its maker documented it on 13 October 2026. "Checked" in the last column says who has read the source: "author" means the author of this spec read it directly; "research" means the research pass read it in a browser but the author could not, because the site refuses automated readers.

### 3.1 What has changed

| ID | Statement | Source | Checked |
|---|---|---|---|
| W1 | 19% of British consumers already use AI tools, such as ChatGPT or search engine summaries, to plan a visit to a pub, bar or restaurant, and half are considering it. The figure comes from the GO Technology report by Zonal and NIQ, published in October 2026, a survey of more than 5,000 British consumers. | S1 | author |
| W2 | Of those who do, 45% use it to look for reviews and ratings, 43% to check typical prices, 38% to view menus and 35% to look up opening times. | S1 | author |
| W3 | Since April 2026, Google's AI Mode in the UK has helped people find somewhere to eat and linked them straight to booking partners, including TheFork, SevenRooms, ResDiary, Mozrest, Foodhub, Dojo, DesignMyNight and OpenTable. | S2 | author |
| W4 | Google says there are no additional requirements to appear in its AI answers, and no special technical work. Its own checklist includes having important content available as text and keeping Business Profile information up to date. | S3 | author |
| W5 | Three in ten UK businesses (30%) reported using at least one AI technology in September 2026, up from 9% in September 2023, according to the Office for National Statistics. | S4 | author |
| W6 | In accommodation and food services the figure was about one in five in June 2026, according to the Office for National Statistics. | S5 | author |
| W7 | The Office for National Statistics found that businesses in accommodation and food services most commonly use free AI software. | S5 | author |
| W8 | In August 2026 the BBC reported a backlash against AI-made posters and menus in bars and restaurants in Northern Ireland: one Belfast bar declared itself an AI-free zone, and a restaurant owner found "Say no to AI" stickers on his flyers. | S6 | author |
| W9 | The paid versions of the main assistants can now be given a job with several steps and left to work through it. OpenAI calls its version ChatGPT Work and launched it for paid plans in July 2026. This is the maker's description. | S7 | research |
| W10 | OpenAI has announced that custom GPTs will be retired on 11 December 2026. | S8 | research |

### 3.2 Shortcuts and settings

ChatGPT unless another assistant is named.

| ID | Statement | Source | Checked |
|---|---|---|---|
| K1 | ChatGPT keeps standing instructions, called custom instructions, that apply to every chat. On the web they are under Settings, then Personalization. On a phone they are under Settings, then Customize ChatGPT. Free accounts get 1,500 characters. | S9 | research |
| K2 | Tapping the + icon and choosing "Add photos & files" lets you show it a photograph or a document. Free accounts are limited to three file uploads a day. | S10 | research |
| K3 | To stop your chats being used to train the model: Settings, then Data controls, then switch off "Improve the model for everyone". | S11 | research |
| K4 | Selecting Temporary when you start a new chat keeps that conversation out of your history, and it is not used for training. | S12 | research |
| K5 | OpenAI's own guidance is to put the instruction first and to separate it from pasted text with `###` or with triple quotation marks. | S13 | research |
| K6 | The `#` sign is not a command in ChatGPT, Copilot, Gemini or Claude. It marks a heading, and OpenAI's guidance says headings help mark the separate sections of a long request. | S14 | author |
| K7 | The Voice icon starts a spoken conversation, and the microphone icon lets you dictate. Both are on all plans, with limits on free accounts. | S15 | research |
| K8 | "New project" in the sidebar keeps the chats, files and instructions for one job together. Free accounts can add five files to a project. | S16 | research |
| K9 | On the web, Ctrl+K on Windows or Cmd+K on a Mac searches all your past chats. | S17 | research |
| K10 | When you are signed in, typing `/` in the message box opens a menu of tools. Choosing Search makes ChatGPT look things up on the live web. Typing `/Deepresearch` starts a longer piece of research with sources. | S18 | research |
| K11 | ChatGPT can run a task on a schedule, managed under "Scheduled" in the sidebar. Free accounts can have three active tasks, each running at most once a day. | S19 | research |
| K12 | In Gemini, typing `@` and choosing an app, such as Google Calendar, tells it which of your connected apps to use. In ChatGPT, `@` picks an app or plugin you have added. | S20, S21 | author (Gemini), research (ChatGPT) |
| K13 | On a Windows PC, the Copilot key, or the Windows key and C together, opens Microsoft Copilot. | S22 | author |
| K14 | In Gemini, the switch is under Activity: turn off "Keep activity". | S23 | author |
| K15 | In Claude, the switch is under Settings, then Privacy: switch off the option under "Help Improve our AI models". Claude also has incognito chats, on every plan, which are not kept in your history. | S24, S25 | author |
| K16 | Microsoft says prompts, responses and file contents in the Microsoft Copilot app are not used to train its foundation models. | S26 | author |
| K17 | The slash "codes" passed around online, such as /ELI5 or /TLDR, are not features of any assistant. They work only as ordinary words the assistant reads, so results vary. If you want a shortcut word of your own, define it in your custom instructions. | S18, S9 | research |

### 3.3 Rules and risks

| ID | Statement | Label | Source | Checked |
|---|---|---|---|---|
| R1 | Data protection law applies in full to AI tools. The Information Commissioner's Office says there is no AI exemption. | LAW, as the regulator states it | S27 | author |
| R2 | Keep guests' details, staff records and allergy information out of free and personal AI accounts. | GOOD PRACTICE | none | n/a |
| R3 | A guest's allergy is information about their health, which data protection law protects more strictly. | LAW | S28 | author |
| R4 | The National Cyber Security Centre warns that these tools can get things wrong and present incorrect statements as facts. | GUIDANCE | S29 | author |
| R5 | A named person checks every date, price, opening time and claim before anything an AI tool wrote is used. | GOOD PRACTICE | none | n/a |
| R6 | The food business is legally responsible for the accuracy of its allergen information, however that information is produced. | LAW | S30 | author |
| R7 | Since 6 April 2025 it has been unlawful to write, or to commission, a fake review: one that claims to be, but is not, based on a person's genuine experience. The law says writing includes "creating by any means", so a review produced by AI is covered. | LAW | S31, S32 | author |
| R8 | Using an AI tool to help draft your own reply to a genuine review is a different thing. Check it and send it as yourself. | GOOD PRACTICE | none | n/a |
| R9 | The advertising regulator says there is no general legal requirement in the UK to say that an advert used AI, and that its existing rules apply however an advert was made. A picture of food or of your pub must not mislead. | GUIDANCE | S33 | author |
| R10 | People decide about people. Do not use an AI tool to choose who to hire, discipline or dismiss. | GOOD PRACTICE | none | n/a |
| R11 | Write your rules on one page and go through them with the team. | GOOD PRACTICE | none | n/a |
| R12 | Treat AI like a junior member of the team: you approve the final version. | GOOD PRACTICE | Peter's own line | n/a |

### 3.4 What you may say about us

Use these sentences as written, in the guide only, and nothing beyond them.

- "At The Anchor, our own venue, we use AI for research, drafting, analysis and repetitive checking."
- "We have no AI number: its contribution has not been measured separately from the wider work."

Do not attach any of the five percentages in `/CLAIMS.md` to AI. Do not describe anything else The Anchor does with AI.

### 3.5 For BII members

| ID | Statement | Source |
|---|---|---|
| B1 | The BII's training pages list a free video course called AI For Publicans. | S34 |
| B2 | BII members have an HR and Employment Law helpline. The number is on the BII's helplines page. | S35 |

Do not print a telephone number. Link to the page.

## 4. Source list

Use these addresses and no others. "Words to find" is what you look for in README section 8.4.

OpenAI's help pages refused automated readers on 13 October 2026. If you cannot open one, record "could not open". Peter checks those on a signed-in account (section 10).

| Code | Publisher and document | Address | Words to find |
|---|---|---|---|
| S1 | NIQ: Nearly a fifth of consumers use AI tools to plan a visit | `https://nielseniq.com/global/en/insights/report/2026/nearly-a-fifth-of-consumers-use-ai-tools-to-plan-a-visit-to-a-pub-bar-or-restaurant/` | "19% of all consumers are already using AI tools" |
| S2 | Google: AI Mode restaurant bookings in the UK, 10 April 2026 | `https://blog.google/company-news/inside-google/around-the-globe/google-europe/united-kingdom/ai-mode-restaurants-uk/` | "TheFork, SevenRooms, ResDiary, Mozrest, Foodhub, Dojo, DesignMyNight and OpenTable" |
| S3 | Google Search Central: AI features and your website | `https://developers.google.com/search/docs/appearance/ai-features` | "There are no additional requirements to appear in AI Overviews or AI Mode" |
| S4 | Office for National Statistics: Business insights and impact on the UK economy, 8 October 2026 | `https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/bulletins/businessinsightsandimpactontheukeconomy/8october2026` | "Around 3 in 10 (30%) of all businesses reported using at least one type of artificial intelligence" |
| S5 | Office for National Statistics: Artificial intelligence in UK businesses, 2023 to 2026 | `https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026` | "most commonly report using free-to-use software". The one-in-five figure is in the data behind Figure 3: accommodation and food service activities, 17.3 and 3.3 |
| S6 | BBC News, 24 August 2026 | `https://www.bbc.com/news/articles/cq89jpjeq7ko` | "Say no to AI" |
| S7 | OpenAI: ChatGPT release notes | `https://help.openai.com/en/articles/6825453-chatgpt-release-notes` | "ChatGPT Work" |
| S8 | OpenAI: Custom GPT retirement and migration FAQ | `https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq` | the retirement date |
| S9 | OpenAI: ChatGPT custom instructions | `https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions` | "Personalization" |
| S10 | OpenAI: ChatGPT image inputs FAQ | `https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq` | "Add photos & files" |
| S11 | OpenAI: Data controls in ChatGPT | `https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt` | "Improve the model for everyone" |
| S12 | OpenAI: Temporary chat in ChatGPT | `https://help.openai.com/en/articles/8914046-temporary-chat-in-chatgpt` | "Temporary" |
| S13 | OpenAI: Best practices for prompt engineering | `https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api` | "###" |
| S14 | OpenAI developer guide: prompt engineering | `https://developers.openai.com/api/docs/guides/prompt-engineering` | "Markdown headers and lists can be helpful to mark distinct sections of a prompt" |
| S15 | OpenAI: ChatGPT Voice | `https://help.openai.com/en/articles/20001274-chatgpt-voice` | the Voice icon |
| S16 | OpenAI: Projects in ChatGPT | `https://help.openai.com/en/articles/10169521-projects-in-chatgpt` | "New project" |
| S17 | OpenAI: Finding your chats, projects and files | `https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt` | "Ctrl+K" |
| S18 | OpenAI: Searching the web with ChatGPT | `https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt` | typing `/` to pick Search |
| S19 | OpenAI: Scheduled tasks in ChatGPT | `https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt` | three active tasks on the free plan |
| S20 | Google: use connected apps in Gemini | `https://support.google.com/gemini/answer/13695044?hl=en-GB` | "enter @ and select the app" |
| S21 | OpenAI: Plugins in ChatGPT | `https://help.openai.com/en/articles/20001256-plugins-in-chatgpt` | selecting a plugin with `@` |
| S22 | Microsoft: access Microsoft 365 Copilot on Windows | `https://support.microsoft.com/en-gb/microsoft-365-copilot/access-microsoft-365-copilot-on-windows` | "Use the Windows key + C keyboard shortcut." |
| S23 | Google: manage your Gemini Apps activity | `https://support.google.com/gemini/answer/13278892?hl=en-GB` | "Turn off Keep activity" |
| S24 | Anthropic: how do I change my model improvement privacy settings? | `https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings` | "Under Help Improve our AI models" |
| S25 | Anthropic: use incognito chats | `https://support.claude.com/en/articles/12260368-use-incognito-chats` | "aren't saved to your chat history" |
| S26 | Microsoft: Copilot activity history | `https://support.microsoft.com/en-gb/privacy/microsoft-copilot/activity-history` | "aren't used to train foundation models" |
| S27 | Information Commissioner's Office: tackling misconceptions about generative AI | `https://ico.org.uk/about-the-ico/what-we-do/our-work-on-artificial-intelligence/response-to-the-consultation-series-on-generative-ai/tackling-misconceptions/` | "AI exemption" |
| S28 | Information Commissioner's Office: what are the rules on special category data? | `https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-are-the-rules-on-special-category-data/` | "special category data" |
| S29 | National Cyber Security Centre: AI and cyber security, what you need to know | `https://www.ncsc.gov.uk/guidance/ai-and-cyber-security-what-you-need-to-know` | "present incorrect statements as facts" |
| S30 | legislation.gov.uk: Regulation (EU) No 1169/2011, Article 8 | `https://www.legislation.gov.uk/eur/2011/1169/article/8` | "shall ensure the presence and accuracy of the food information" |
| S31 | legislation.gov.uk: Digital Markets, Competition and Consumers Act 2024, Schedule 20 | `https://www.legislation.gov.uk/ukpga/2024/13/schedule/20` | "creating by any means" |
| S32 | Competition and Markets Authority: fake reviews guidance | `https://www.gov.uk/government/publications/fake-reviews-cma208` | the page opens and lists the guidance |
| S33 | Advertising Standards Authority and CAP: disclosure of AI in advertising, 29 May 2025 | `https://www.asa.org.uk/news/disclosure-of-ai-in-advertising-striking-the-balance-between-creativity-and-responsibility.html` | "There is no blanket legal requirement in the UK to disclose the use of AI in ads" |
| S34 | BII: AI For Publicans | `https://bii.org/training-course/ai-for-publicans/` | "AI For Publicans" |
| S35 | BII: helplines | `https://bii.org/resources-hub/helplines/` | "HR & Employment Law" |

Every address above was checked on 13 October 2026 against the British English gate (README section 5.4, trap 2). All pass. One source the research used is deliberately left out because its address fails that gate: do not link to any tomsguide.com article.

## 5. The printed article

Both versions follow the anatomy in README section 4.1. "Locked" wording is used exactly as written, because it carries a figure, a legal point or a menu name. Where it says "yours", you write it inside the budget.

Before you assemble either version, check the month in the last line of the box. It says "Checked October 2026". Change it to the month in which you ran README section 8.4.

### 5.1 The long version

Block id `a1-long`, `min="500" max="550" must="Peter Pitcher MBII"`.

| Part | Wording | Words |
|---|---|---|
| Introduction | Yours, 38 to 45 words. Say that AI has moved on, that guests now use it to choose where to go, that it can read a photograph and listen, and end on the line "Start with a job, not a tool." No statistics here. Approved example you may use as it stands: "AI has moved on from writing quiz posters. Your guests now ask it where to eat and drink. It can read a photograph and listen to you talk. And the main assistants have shortcuts worth knowing. Start with a job, not a tool." | 43 |
| Headline | Locked: "Five ways to put AI to work in your pub" | 10 |
| Byline sentence | Locked: "Here, Peter Pitcher MBII sets out what has changed, five jobs worth handing over and the shortcuts that make it quicker:" | 21 |
| 1 | Subhead locked: "See your pub the way AI does". Body locked: "Nearly one in five British consumers already use AI tools such as ChatGPT to plan a pub or restaurant visit, checking reviews, prices, menus and opening times (Zonal and NIQ, October 2026). Since April 2026, Google's AI Mode has linked UK searchers straight to booking partners. Ask an assistant where to go for Sunday lunch in your town and check what it says about you. Google's own advice is the basics: important content, such as menus and hours, as text on your website, and an up-to-date Business Profile." | 96 |
| 2 | Subhead locked: "Tell it who you are, once". First sentence locked: "ChatGPT keeps standing instructions that apply to every chat: Settings, then Personalization, or Customize ChatGPT on a phone." Then two sentences of yours: what to tell it (the pub's name and town, who the customers are, how you write), and one line to add: never invent prices, dates, opening times or allergen information. | 54 |
| 3 | Subhead locked: "Show it, don't type it". First sentence locked: "Tap the + icon and choose Add photos & files." Then yours: two or three things to photograph that carry no personal details (a specials board, a delivery note, a supplier's price list) and what to ask for; the microphone as another way in; and a last sentence telling the reader to leave out anything with a guest's or a team member's name on it. | 55 |
| 4 | Subhead locked: "Give it a weekly job". First sentence locked: "ChatGPT can run a task on a schedule: the free plan allows three." Then yours: one example (a draft of the week's posts from the events list every Monday morning, which the reader then edits) and one sentence on keeping a job's notes and files together in a project. | 48 |
| 5 | Subhead locked: "Keep three rules". Body locked: "First, guests' details, staff records and allergy information stay out of free and personal accounts: the data protection regulator says there is no AI exemption. In Settings, Data controls, switch off "Improve the model for everyone". Second, a named person checks every date, price and claim, because these tools can state wrong things as fact. Third, AI never decides what is in a dish and never writes a review: allergen accuracy is your legal duty, and an invented review is a fake review in law." | 89 |
| Box | Title locked: "Shortcuts worth knowing". Five bullets and a date line, all locked, in section 5.3. | 105 |
| Last line | Locked: "The full guide has prompts to copy, the shortcuts for four assistants and a one-page policy for your team: scan the code below." | 23 |

This plan was assembled and run through the counter on 13 October 2026: it passed at 544 words. You have six words of room. If you are over, shorten your own sentences in sections 2, 3 and 4.

### 5.2 The short version

Block id `a1-short`, `min="260" max="300" must="Peter Pitcher MBII"`.

Every part is locked. There is no room for anything else: assembled, it comes to 297 words.

| Part | Wording |
|---|---|
| Introduction | "Your guests now ask AI where to eat and drink, and the main assistants have shortcuts worth knowing. Start with a job, not a tool." |
| Headline | "Three ways to put AI to work in your pub" |
| Byline sentence | "Here, Peter Pitcher MBII sets out three jobs worth handing over, and the shortcuts that make it quicker:" |
| 1 | Subhead: "See your pub the way AI does". Body: "Nearly one in five British consumers already use AI tools to plan a pub or restaurant visit (Zonal and NIQ, October 2026). Ask an assistant where to go for Sunday lunch in your town and check what it says about you. Then fix the basics: menus and hours as text on your website, and an up-to-date Google Business Profile." |
| 2 | Subhead: "Tell it once, then show it". Body: "In ChatGPT, open Settings, then Personalization (Customize ChatGPT on a phone), and say who you are and how you write. Then tap + and choose Add photos & files to turn a specials board or a delivery note into a post or a table." |
| 3 | Subhead: "Keep three rules". Body: "No guests' details, staff records or allergy information in free or personal accounts. A named person checks every date, price and claim. And AI never decides what is in a dish and never writes a review: allergen accuracy is your legal duty, and an invented review is a fake one in law." |
| Box | Title: "Shortcuts worth knowing". Four bullets and a date line, in section 5.3. |
| Last line | "Scan the code for prompts to copy and the full shortcut sheet." |

### 5.3 The box

Write each bullet with its symbol in bold at the start.

Long version:

```markdown
## Shortcuts worth knowing
- **/** In ChatGPT, signed in, type / and choose Search to make it check the live web.
- **@** Calls in an app you have connected. In Gemini, type @ and pick one, such as Google Calendar.
- **###** Put ### or triple quotation marks before and after text you paste in, so the assistant can tell your instruction from your material.
- **#** Not a command in any of the main assistants: it marks a heading in a long request.
- **Not shortcuts** The "secret codes" shared online, such as /ELI5, are not features. They work only as ordinary words.
- Checked October 2026. Menus move.
```

Short version:

```markdown
## Shortcuts worth knowing
- **/** In ChatGPT, signed in, type / and choose Search to check the live web.
- **@** In Gemini, type @ to pick a connected app, such as Google Calendar.
- **###** Put ### before and after pasted text to separate it from your instruction.
- **#** Not a command anywhere: it marks a heading.
- Checked October 2026.
```

### 5.4 The furniture block

Block id `a1-furniture`, `max="60"`, `must="orangejelly.co.uk/pub-ai"`. One furniture block serves both versions.

- Bio box: the fixed bio from README section 4.7.
- Footer strip, locked: "The full guide has prompts to copy, a shortcut sheet for four assistants and a one-page AI policy for your team. Scan the code or visit orangejelly.co.uk/pub-ai"

### 5.5 Checks specific to this print piece

- [ ] All three blocks print `PASS`.
- [ ] The month in each box's date line is the month you ran README section 8.4.
- [ ] Zonal and NIQ are named in the same sentence as the consumer figure.
- [ ] No price, no product other than ChatGPT, Gemini and Google, no named booking partner.
- [ ] The words "custom GPT", "canvas", "agent mode" and "Gems" do not appear.
- [ ] Nothing says what The Anchor does.

## 6. The guide

### 6.1 Front matter

Copy this exactly. Change only the two dates, to the day you build. Never use a date in the future: the site hides a guide until its date arrives, so the build would skip it and the short link would lead nowhere.

```yaml
---
title: "AI for Pubs: What Is New, What Works and Where to Start"
slug: "ai-for-pubs"
publishedDate: 2026-10-13
updatedDate: 2026-10-13
excerpt: "AI for pubs, from a working licensee: what has changed, the jobs it does well, the shortcuts worth knowing and the house rules that keep you out of trouble."
quickAnswer: "Start with one assistant and one job. Tell it who you are in its custom instructions, show it photographs instead of typing, and give it a weekly task. Keep guests' details, staff records and allergen decisions away from it, and have a named person check everything before it is used. Then look at how AI describes your pub to guests."
author: "Peter Pitcher"
category: "operations"
featuredImage: "/images/blog/default.svg"
tags:
  - "AI for pubs"
  - "ChatGPT for pubs"
  - "pub technology"
  - "hospitality AI"
status: "published"
metaDescription: "A licensee's guide to AI for pubs: what has changed, twelve jobs to hand over, what the slash, at and hash signs really do, and the rules to set first."
keywords:
  - "AI for pubs"
  - "ChatGPT for pubs"
  - "AI in hospitality"
  - "AI tools for pubs"
  - "ChatGPT shortcuts"
localSEO: {"localModifiers":["pubs","hospitality","UK"],"targetLocation":"United Kingdom"}
voiceSearchQueries:
  - "how can a pub use AI"
  - "is it safe to use ChatGPT for my pub"
  - "what does typing a slash do in ChatGPT"
  - "do customers use AI to choose a pub"
faqs:
  - question: "Is ChatGPT free for a pub to use?"
    answer: "Yes, there is a free plan, and official figures show that hospitality businesses using AI most commonly use free software. Free accounts have limits, for example on file uploads and scheduled tasks. Before you pay for anything, switch off training in the settings and decide what information will never go into it."
  - question: "Is it safe to put customer or staff details into an AI tool?"
    answer: "Keep them out of free and personal accounts. Data protection law applies in full to AI tools: the Information Commissioner's Office says there is no AI exemption. A guest's allergy is health information, which the law protects more strictly still. Remove names and details before you paste anything in."
  - question: "Can AI write my allergen information?"
    answer: "No. It can lay out a table you have already checked, but it must never decide what is in a dish. The food business is legally responsible for the accuracy of its allergen information however that information is produced, and these tools can state wrong things as fact."
  - question: "What does typing a slash do in ChatGPT?"
    answer: "When you are signed in, typing a slash in the message box opens a menu of tools, and choosing Search makes it look things up on the live web. The slash codes shared online, such as /ELI5, are not features: they are ordinary words the assistant reads, so results vary."
  - question: "Does the hash sign do anything in ChatGPT?"
    answer: "Not as a command, in ChatGPT or in Copilot, Gemini or Claude. It marks a heading. OpenAI's guidance says headings help mark the separate sections of a long request, and it suggests three hash signs or triple quotation marks to fence off text you paste in."
  - question: "Do customers really use AI to choose a pub?"
    answer: "Some do. A survey of more than 5,000 British consumers for Zonal and NIQ, published in October 2026, found that 19% already use AI tools to plan a visit to a pub, bar or restaurant, mainly to check reviews, prices, menus and opening times. Half said they were considering it."
  - question: "Can I use AI to reply to reviews?"
    answer: "You can use it to draft your own reply to a genuine review, then check it and send it as yourself. What the law bans is fake reviews: since April 2025 it has been unlawful to write or commission a review that is not based on a real person's experience, and that covers reviews created by any means, AI included."
  - question: "Do I have to say when a poster or advert was made with AI?"
    answer: "There is no general legal requirement in the UK to say so, the advertising regulator says. But its rules apply however an advert was made, so a picture must not mislead: show the dish and the room a guest will actually get. Some customers dislike AI artwork, as the BBC reported in August 2026."
---
```

### 6.2 Length

2,400 to 3,200 words in the body.

### 6.3 Section order

Start the body with `# AI for Pubs: What Is New, What Works and Where to Start`, then the opening, then these H2 sections in this order. Use the H2 wording given.

| # | H2 | What it does | Facts | Words |
|---|---|---|---|---|
| 0 | (opening, no H2) | Who this is for. That it is not another "getting started" piece. The line "Start with a job, not a tool." One sentence saying the details about each tool were checked on the date you ran README section 8.4 and that they change often. | none | 130 to 180 |
| 1 | `## What has changed` | Guests using AI to choose (W1, W2). Google's AI linking to bookings (W3). How far business use has got (W5, W6, W7). The backlash against AI artwork (W8). That paid assistants can now take a job with several steps (W9, as the maker's description). That tools get withdrawn too (W10): one sentence. | W1 to W10 | 300 to 380 |
| 2 | `## See your pub the way AI does` | The exercise: ask an assistant about your own pub. Block B from section 6.5. What to do about what it gets wrong (W4). Links to the Google Business Profile guide and the website guide. | W4 | 220 to 280 |
| 3 | `## Set it up once` | Use the assistant you already have. Switch off training first (K3). Custom instructions (K1), then Block A from section 6.5. Projects (K8). | K1, K3, K8 | 250 to 320 |
| 4 | `## Twelve jobs worth handing over` | One sentence, then the twelve prompts in section 6.6, each under an H3, each followed by its "Check before you use it" line. | K2, K7, K11 | 120 to 180 plus the prompts |
| 5 | `## The shortcuts worth knowing` | What the three signs do (K10, K12, K5, K6). Table C from section 6.4. Block C from section 6.5 as the worked example. The "secret codes" (K17). | K4 to K13, K17 | 250 to 320 plus the table |
| 6 | `## House rules: what never goes into AI` | The rules, each with its reason. Then Table D from section 6.4 (where the training switch is). Then Block D from section 6.5 (the one-page policy). For BII members, statement B2 with a link. | R1 to R12, K3, K14 to K16, B2 | 350 to 430 plus the table and block |
| 7 | `## Ask your suppliers what is already included` | Short. Before paying for a new tool, ask your till, booking, rota and accounts suppliers three questions: what AI features are included in what you already pay; whether your data is used to train their models; and whether you can switch a feature off. Name no supplier and no product. | none | 120 to 170 |
| 8 | `## A first month` | A four-week plan as a numbered list: week one, settings and house rules; week two, one job from the twelve; week three, a weekly scheduled task; week four, the exercise in section 2 and the fixes it throws up. For BII members, statement B1 with a link. | B1 | 180 to 240 |
| 9 | `## What we use it for, and what we will not claim` | The two sentences from 3.4, word for word. Then links to `/tools/ai-readiness` and `/growth-problems/using-ai-intelligently`. | 3.4 | 70 to 110 |
| 10 | `## Sources` | The source list from section 6.7. | none | list only |

Internal links you may use, each at least once where it fits:

| Path | Use it for |
|---|---|
| `/guides/google-business-profile-pub-guide` | Keeping the Business Profile up to date |
| `/guides/does-your-pub-need-a-website` | Having your menu and hours as text on your own site |
| `/guides/how-to-respond-bad-pub-reviews` | Replying to reviews |
| `/guides/social-media-strategy-for-pubs` | Posts |
| `/guides/food-allergies-gdpr-compliance` | Allergens and data protection |
| `/guides/pub-epos-system-guide` | Tills |
| `/tools/ai-readiness` | An honest read on where AI would and would not pay |
| `/growth-problems/using-ai-intelligently` | Where AI fits in a business |

Do not link to `/guides/pub-event-food-safety-allergens` unless `content/blog/pub-event-food-safety-allergens.md` exists on your branch.

### 6.4 Locked tables

**Table C.** Use in section 5.

```markdown
| What you type or tap | What it does | Where |
|---|---|---|
| `/` | Opens a menu of tools. Choose Search to make it check the live web | ChatGPT, signed in |
| `/Deepresearch` | Starts a longer piece of research with sources | ChatGPT, signed in |
| `@` | Picks an app you have connected, such as Google Calendar | Gemini. In ChatGPT it picks an app or plugin you have added |
| `###` or triple quotation marks | Fences off text you paste in from your instruction | Any assistant |
| `#` at the start of a line | Marks a heading in a long request. It is not a command | Any assistant |
| The + icon, then "Add photos & files" | Shows it a photograph or a document | ChatGPT |
| The microphone icon | Lets you dictate instead of typing | ChatGPT |
| Ctrl+K, or Cmd+K on a Mac | Searches your past chats | ChatGPT on the web |
| "Temporary", when you start a new chat | Keeps that conversation out of your history | ChatGPT |
| "New project", in the sidebar | Keeps one job's chats, files and instructions together | ChatGPT |
| The Copilot key, or the Windows key and C | Opens Copilot | Windows PCs |
```

**Table D.** Use in section 6.

```markdown
| Assistant | Where the training switch is |
|---|---|
| ChatGPT | Settings, then Data controls: switch off "Improve the model for everyone" |
| Gemini | Activity: turn off "Keep activity" |
| Claude | Settings, then Privacy: switch off the option under "Help Improve our AI models" |
| Microsoft Copilot | No switch. Microsoft says prompts, responses and files in the Copilot app are not used to train its foundation models |
```

### 6.5 Locked blocks

**Block A: custom instructions.** Use in section 3, as a block quote. It is under the 1,500 characters a free account allows.

```markdown
> I run [PUB NAME], a [village local / town-centre pub / food-led pub] in [TOWN]. We serve [FOOD STYLE] and open [DAYS AND HOURS]. Our regulars are [WHO THEY ARE]. This year we want more [MIDWEEK DINERS / PRIVATE HIRE / SUNDAY BOOKINGS].
>
> Write in British English, in a warm, plain voice, the way a good landlord talks. Short sentences. No hashtags unless I ask for them.
>
> Never invent prices, dates, opening times, awards or allergen information. If you need one, ask me.
>
> If I type /short, answer in three sentences or fewer.
```

After the block, add one sentence of your own explaining that the last line is how you make a shortcut word of your own (K17).

**Block B: three questions to ask about your own pub.** Use in section 2, as a block quote.

```markdown
> Where would you recommend for Sunday lunch near [TOWN]? Give me three places and say why.
>
> What are the opening hours and food service times at [PUB NAME] in [TOWN]? Tell me where you found them.
>
> I am booking a birthday meal for twelve near [TOWN]. Which pubs take group bookings?
```

**Block C: fencing off pasted text.** Use in section 5, as a block quote.

```markdown
> Rewrite the notes between the ### marks as a Facebook post of under 80 words. Keep every fact and add none.
>
> ###
> [PASTE YOUR NOTES HERE]
> ###
```

**Block D: the one-page policy.** Use in section 6, as a block quote.

```markdown
> **How we use AI at [PUB NAME]**
>
> 1. We use [NAME OF ASSISTANT] on the pub's account, not on personal accounts.
> 2. Nothing about a guest or a member of the team goes into it: no names, contact details, booking records, payroll or health information.
> 3. It never decides what is in a dish. Allergen information comes from the allergen chart and nowhere else.
> 4. It never writes a review, and nobody asks a friend or a member of the team to post one.
> 5. [NAMED PERSON] checks every date, price, opening time and claim before anything it wrote is used.
> 6. Pictures show what a guest will actually get: our food, our rooms, our people.
> 7. People decide about people. It is not used to choose who we hire, discipline or dismiss.
> 8. If something it produced goes wrong, tell [NAMED PERSON] the same day.
```

### 6.6 The twelve prompts

Use in section 4. Give each one an H3 with the job's name, then the prompt as a block quote exactly as written, then the line "Check before you use it:" with the check given. Do not add prompts and do not change the wording inside a block quote.

| # | H3 | Prompt | Check before you use it |
|---|---|---|---|
| 1 | One event, three posts | Here are the details of an event at my pub, between the ### marks. Write three versions: a Facebook post of under 80 words, an Instagram caption of under 50 words, and a two-line update for my Google Business Profile. Use only the facts I have given. ### [EVENT, DATE, TIME, PRICE, HOW TO BOOK] ### | The date, the time and the price. |
| 2 | A reply to a review | Between the triple quotation marks is a review a customer left for my pub. Draft a reply of under 90 words. Thank them, answer the point they raised, and do not offer anything I have not mentioned. """ [PASTE THE REVIEW, WITHOUT THE REVIEWER'S NAME] """ | That every fact in the reply is true. Send it as yourself. |
| 3 | A reply to a party enquiry | Draft a reply to an enquiry about hiring our function room. What they asked is between the ### marks. Ask for the date, the numbers, the timings and the budget if any are missing. Ask whether anyone in the party has a food allergy, intolerance or coeliac disease. Do not quote a price. ### [WHAT THEY ASKED, WITHOUT THEIR NAME OR CONTACT DETAILS] ### | That it promises nothing you cannot deliver. |
| 4 | The specials board, typed up | This is a photograph of today's specials board. Type it up as a list, then write a post of under 60 words about the two dishes you would lead with. Do not describe any dish as free from an allergen. | Dish names and prices against the board. |
| 5 | Order against delivery | These two photographs are my order and the delivery note. List anything that is missing, short or substituted. | The list against the goods in front of you, and any substitution against your allergen chart. |
| 6 | Two price lists, one table | These are price lists from two suppliers. Build a table of the items that appear on both, with each price and the difference. List separately anything you could not match. | Pack sizes and units, then the arithmetic. |
| 7 | Menu descriptions | Rewrite these dish descriptions so that each is under 20 words and says what the guest will taste. Keep every ingredient I have listed and add none. Do not mention allergens or make any dietary claim. ### [DISH NAMES AND INGREDIENTS] ### | That each description matches the dish you serve. |
| 8 | A run sheet for an event | Write a run sheet for a [QUIZ NIGHT / LIVE MUSIC NIGHT / PRIVATE PARTY] at my pub, from two hours before doors to close. Give each step a time, the job to do and the role responsible. Use roles, not names. | Timings, and your licence conditions. |
| 9 | Tonight's briefing | Turn these notes into a team briefing of under 120 words that I can read out before service. Use roles, not names. ### [NUMBER OF BOOKINGS AND TIMES, SPECIALS, WHAT IS OFF, WHAT TO RECOMMEND] ### | That nothing in it names a guest. |
| 10 | A letter in plain English | Explain this letter in plain English. List what it asks me to do and by when, and the questions I should put to my accountant, my solicitor or my business development manager. Do not advise me on what to do. | Cover names and account numbers before you photograph it. It explains, it does not advise. |
| 11 | The week's posts, every Monday | Every Monday at 8am, using the events list in this project, draft this week's posts: one for today, one for Thursday and one for Saturday morning. Under 70 words each. Tell me which facts you were unsure of. | Everything. A scheduled draft is still a draft. |
| 12 | Thinking it through out loud | I am going to talk through a problem at my pub. Ask me one question at a time until you understand it, then give me three options and the drawback of each. | The decision is yours. |

In the guide, put each `###` and each `"""` on its own line inside the block quote, as Block C shows.

### 6.7 The Sources section

End the guide with this, keeping only the lines for sources you used. Then the closing line.

```markdown
## Sources

- [Nearly a fifth of consumers use AI tools to plan a visit to a pub, bar or restaurant (NIQ, October 2026)](https://nielseniq.com/global/en/insights/report/2026/nearly-a-fifth-of-consumers-use-ai-tools-to-plan-a-visit-to-a-pub-bar-or-restaurant/)
- [Agentic restaurant bookings in AI Mode in the UK (Google, 10 April 2026)](https://blog.google/company-news/inside-google/around-the-globe/google-europe/united-kingdom/ai-mode-restaurants-uk/)
- [AI features and your website (Google Search Central)](https://developers.google.com/search/docs/appearance/ai-features)
- [Business insights and impact on the UK economy, 8 October 2026 (Office for National Statistics)](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/bulletins/businessinsightsandimpactontheukeconomy/8october2026)
- [Artificial intelligence in UK businesses, 2023 to 2026 (Office for National Statistics)](https://www.ons.gov.uk/businessindustryandtrade/business/businessservices/articles/artificialintelligenceinukbusinesses/2023to2026)
- [The bars and restaurants turning against AI artwork (BBC News, 24 August 2026)](https://www.bbc.com/news/articles/cq89jpjeq7ko)
- [ChatGPT release notes (OpenAI)](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- [ChatGPT custom instructions (OpenAI)](https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions)
- [Data controls in ChatGPT (OpenAI)](https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt)
- [Best practices for prompt engineering (OpenAI)](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
- [Searching the web with ChatGPT (OpenAI)](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt)
- [Scheduled tasks in ChatGPT (OpenAI)](https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt)
- [Use connected apps in Gemini (Google)](https://support.google.com/gemini/answer/13695044?hl=en-GB)
- [Manage your Gemini Apps activity (Google)](https://support.google.com/gemini/answer/13278892?hl=en-GB)
- [Model improvement privacy settings (Anthropic)](https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings)
- [Copilot activity history (Microsoft)](https://support.microsoft.com/en-gb/privacy/microsoft-copilot/activity-history)
- [Tackling misconceptions about generative AI (Information Commissioner's Office)](https://ico.org.uk/about-the-ico/what-we-do/our-work-on-artificial-intelligence/response-to-the-consultation-series-on-generative-ai/tackling-misconceptions/)
- [AI and cyber security: what you need to know (National Cyber Security Centre)](https://www.ncsc.gov.uk/guidance/ai-and-cyber-security-what-you-need-to-know)
- [Digital Markets, Competition and Consumers Act 2024, Schedule 20 (legislation.gov.uk)](https://www.legislation.gov.uk/ukpga/2024/13/schedule/20)
- [Fake reviews guidance (Competition and Markets Authority)](https://www.gov.uk/government/publications/fake-reviews-cma208)
- [Disclosure of AI in advertising (Advertising Standards Authority and CAP, 29 May 2025)](https://www.asa.org.uk/news/disclosure-of-ai-in-advertising-striking-the-balance-between-creativity-and-responsibility.html)
- [Regulation (EU) No 1169/2011, Article 8 (legislation.gov.uk)](https://www.legislation.gov.uk/eur/2011/1169/article/8)

Sources checked on <the date you ran README section 8.4>. AI tools change often: a menu or a setting described here may have moved since.
```

The BBC line uses a description, not the article's own headline. Keep it as written.

## 7. Repo wiring

Follow README sections 6 and 7. The values for this article:

**Mapping.** In `tasks/repositioning/data/article-next-steps.json`, add this entry between `"30-day-action-plan-stabilise-hospitality"` and `"autumn-pub-event-ideas"`:

```json
 "ai-for-pubs": {
  "caseStudy": null,
  "problem": "using-ai-intelligently"
 },
```

**Short link.** In `src/lib/route-manifest.js`, at the end of `CAMPAIGN_REDIRECTS`:

```js
  {
    source: '/pub-ai',
    destination:
      '/guides/ai-for-pubs?utm_source=bii&utm_medium=print-magazine&utm_campaign=ai-for-pubs-2026',
  },
```

**Tests.** Add `'/pub-ai'` to the array in `src/test/printed-urls.test.ts` and to the array in `src/test/route-manifest.test.ts`, raising the expected length there by one. Update the guide count as README section 7 describes.

**The extra edit: the list of orphaned problems.** `src/test/article-next-step.test.ts` records that one growth problem, `using-ai-intelligently`, had no guide leading to it, because no hospitality guide was about AI. This guide is. Mapping it there empties that list, and the test's comments must say why, or the next person will read a comment that is no longer true.

In the test named `records exactly which problems have no way in from search`, replace the comment paragraphs that begin "One is orphaned and it is the right answer" and end "article should be forced there." with:

```ts
     * None is orphaned now. `using-ai-intelligently` was until October 2026, because
     * nothing in the hospitality library was about AI, and pointing an EPOS guide at
     * the AI page would have been a dishonest handoff for a reader who came to find
     * out about a till. `content/blog/ai-for-pubs.md` is about exactly that subject,
     * so it leads there honestly.
     *
     * The list stays, empty, so that the next problem page added without an article
     * behind it fails here and has to be written down, not discovered.
```

Keep the first paragraph of that comment ("A problem page with no article pointing at it...") as it is. Then replace the line `const KNOWN_ORPHANS = ['using-ai-intelligently'];` with:

```ts
    const KNOWN_ORPHANS: string[] = [];
```

In the next test, change its name from `gives the AI problem its way in from the insights collection instead` to `gives the AI problem a way in from the insights collection as well`, and replace its two comment lines with:

```ts
    // The AI problem page has two ways in from search: the hospitality guide on AI,
    // and an article written for the sector that searches for it most.
```

Change nothing else in that file apart from the guide count.

**QR code.**

```bash
python3 tasks/bii-articles-2026/make-qr.py https://www.orangejelly.co.uk/pub-ai marketing/bii-ai-2026 bii-ai-2026-qr
```

```bash
swift tasks/bii-articles-2026/read-qr.swift marketing/bii-ai-2026/bii-ai-2026-qr.png https://www.orangejelly.co.uk/pub-ai
```

## 8. Checks specific to this guide

Run these after README section 8.

- [ ] The body is 2,400 to 3,200 words.
- [ ] `publishedDate` and `updatedDate` are the day you built: not 2026-10-13 unless that is today, and not a future date.
- [ ] Tables C and D, Blocks A to D, the twelve prompts and all eight FAQ answers are word for word.
- [ ] Every statistic names its source in the same sentence and links to it.
- [ ] No prompt asks for, or contains, a guest's or a team member's details.
- [ ] No prompt asks the assistant to say what a dish contains or is free from.
- [ ] The guide names no software price and no supplier other than OpenAI, Google, Microsoft, Anthropic and their assistants.
- [ ] `grep -niE "custom GPT|canvas|agent mode|gems|pulse|atlas" content/blog/ai-for-pubs.md` returns only the one sentence built from fact W10.
- [ ] `grep -niE "privacy center|saved memories" content/blog/ai-for-pubs.md` returns nothing.
- [ ] `grep -n "tomsguide" content/blog/ai-for-pubs.md` returns nothing.

## 9. Do not say

These were true once, or are repeated online, and are wrong or unsafe to print as of 13 October 2026.

| Do not say | Why |
|---|---|
| That `#` is a command or a shortcut in any assistant | No maker documents one. It is only a heading mark. |
| That /ELI5, /TLDR, /HUMANIZE or any similar "code" is a feature | They are ordinary words the assistant reads. |
| Anything about custom GPTs beyond fact W10, or `@` as a way to call a custom GPT | They are being retired. |
| Agent mode, `/agent`, canvas, Pulse, the Atlas browser, group chats | All withdrawn from ChatGPT during 2026. |
| Gems in Gemini | Being removed for personal accounts in November 2026. |
| Any ChatGPT keyboard shortcut other than Ctrl+K and Cmd+K | None of the others is in OpenAI's current help pages. |
| That ChatGPT can connect to your email or calendar | OpenAI says availability depends on plan and region, and the UK is not confirmed for personal accounts. |
| That ChatGPT can book a table | OpenAI says "globally" without naming the UK. Google's UK launch (W3) is the confirmed one. |
| Meta AI in WhatsApp, in any form | Its UK availability could not be confirmed. |
| That Claude makes pictures | It does not. |
| A price for any plan | Prices change and print cannot. |
| "Privacy Center", "Saved memories", or any button with "save" in its name | They trip the content gates (README section 5.4). |
| That AI "saves" time or money, in those words | Same reason. Write "gives you the hours back" or "frees up". |
| The figures 25 hours a week, £50,000, 250 covers, or food rising from 7% to 25% | The first is a retired claim. The others were printed by BII News in spring 2026 and are not approved claims. |
| That The Anchor's results came from AI | The site says AI's contribution has not been measured. |

### Not settled

- Whether the `/` menu appears on a phone, and the full list of what it shows: no help page says.
- Whether the ChatGPT connections to Gmail, Outlook and calendars work on UK personal plans.
- Whether the ChatGPT desktop shortcut keys still apply after the new desktop app of July 2026.

Do not write about any of these.

## 10. What only Peter can do

Put this list in the hand-back, as written.

- [ ] Read and approve both print versions and say which one the BII wants.
- [ ] On a signed-in ChatGPT account, confirm three things before print: that typing `/` opens a menu with Search in it; that custom instructions are under Settings then Personalization; and that the training switch is under Settings then Data controls. The research could not sign in to check.
- [ ] Open the OpenAI sources that the build could not open (the hand-back lists them) and confirm they still say what the fact bank says.
- [ ] Confirm with the BII News editor whether the word limits cover the article or the whole page.
- [ ] Decide whether the short link stays as `orangejelly.co.uk/pub-ai`.
- [ ] Decide whether to add a first-hand example of AI in use at The Anchor. The spec allows only the two sentences in section 3.4.
- [ ] Say when to push the branch.
- [ ] Scan a printed proof of the QR code with a phone before the page goes to press.
- [ ] Supply a hero photograph for the guide if wanted.
