# AI assistant shortcuts: research dossier

> **Background evidence, gathered on 13 October 2026.** This file is for Peter. It is not approved for use in copy: only the fact banks in the two specs are, and some claims here were left out of them on purpose. See `../README.md`, section 2.3. File paths that mention a scratchpad point at working files that were not kept.


Research date: 13 October 2026. Audience: UK pub landlords (BII members), mostly non-technical. Purpose: an accurate inventory of real shortcuts in ChatGPT, Microsoft Copilot, Google Gemini, Claude, Perplexity and Meta AI in WhatsApp, for a printed article.

## 0. How to read this

### Status key

| Status | Meaning |
|---|---|
| VERIFIED | Stated in the vendor's own documentation, read on 13 October 2026. Where marked PM, the exact wording was phrase-matched by script against the live page. |
| SECONDARY | Found only in technology press, or only by testing the product. Not in vendor documentation. |
| UNVERIFIED | Looked for in vendor documentation and not found. Do not print as fact. |
| MYTH | Presented online as a product feature, but it is only text the model reads as an instruction. |
| RETIRED / RETIRING | Was real, is now removed or has a published end date. Do not print as current. |

### Method and limits

- OpenAI help pages (help.openai.com) block automated fetches. Every OpenAI claim below was checked in a real browser against the live page, and the wording was phrase-matched (122 phrase checks, no failures). Early page discovery used a text-rendering reader, which was found to drop warning banners, so nothing from it is relied on without the browser check.
- Anthropic, Google, Microsoft and Perplexity pages were fetched directly from the vendor sites. 121 evidence phrases were phrase-matched against those copies, no failures.
- WhatsApp help pages were read in a real browser from the page's own embedded article data.
- The web search allowance for the session ran out part way through. After that, only vendor sites and one known press URL were read directly. That is why technology press confirmation is thin (one article), and why no OpenAI staff statement on "cheat codes" was found.
- Verbatim quotes: this assistant may reproduce only one short quote per document, for copyright reasons. So the evidence column paraphrases the source and gives the exact setting names, commands and keys (in bold or code). Each row has the URL, so the exact sentence can be lifted from the live page by the editor.
- Dates: OpenAI pages show relative dates (for example "Updated: 15 days ago"). These are converted to an approximate calendar date, counted back from 13 October 2026.
- Plans: ChatGPT personal plans named in the documentation are Free, Go, Plus and Pro. Prices were not checked and none are given here.
- Assumption: readers use personal accounts, mostly on a phone or in a web browser, not company-managed workspaces.

## 1. What changed between mid 2025 and October 2026 (the traps)

These are the changes most likely to make an article wrong. All are from vendor documentation.

| Product | Change | Date | Source |
|---|---|---|---|
| ChatGPT | Custom GPTs are scheduled to retire on 11 December 2026. New GPT creation and publishing is already closed on personal accounts (Free, Go, Plus, Pro). Replacement is plugins. | Announced 11 Sep 2026 | https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq (about 3 Oct 2026); https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq |
| ChatGPT | Agent mode is gone. The agent article carries a banner saying it is no longer available and points to ChatGPT Work, which is for paid plans (not Free or Go). | Work launched 9 Jul 2026 | https://help.openai.com/en/articles/11752874-chatgpt-agent (about 15 Sep 2026); https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex |
| ChatGPT | Canvas was removed from the current models. Drafting now happens in writing blocks and code blocks inside the chat. The old canvas help article no longer exists. | 28 May 2026 | Release notes; https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt |
| ChatGPT | Connectors were renamed apps (app directory, 18 Dec 2025), and the app directory was then replaced by the plugin directory (9 Jul 2026). | 2025 to 2026 | Release notes; https://help.openai.com/en/articles/20001256-plugins-in-chatgpt |
| ChatGPT | Pulse was sunset, with proactive updates moved into scheduled tasks. Atlas browser stopped working on 9 August 2026. Group chats were closed to new groups from 9 July 2026. Voice in the old macOS app was retired on 15 January 2026. | 2026 | Release notes: https://help.openai.com/en/articles/6825453-chatgpt-release-notes (about 9 Oct 2026) |
| ChatGPT | New desktop app (Chat, Work and Codex in one). The previous app is now called ChatGPT Classic. | 9 Jul 2026 | https://help.openai.com/en/articles/20001276-moving-to-the-new-chatgpt-desktop-app |
| ChatGPT | Adverts began rolling out to Free and Go users in the UK. Paid plans stay ad-free. | 4 Jun 2026 | Release notes; https://help.openai.com/en/articles/20001047-ads-in-chatgpt |
| ChatGPT | Temporary chat gained a personalised option and a save option. Scheduled tasks opened to Free users (three active tasks). Custom instruction limit rose to 5,000 characters on paid plans. Pinned chats arrived. | 2025 to 2026 | Release notes (27 Aug 2026, 25 Aug 2026, 15 Jul 2026, 18 Dec 2025) |
| Copilot | An updated Copilot app replaced the consumer app from 18 August 2026. Deep Research, Podcasts and Group Chat were retired for consumers. Copilot Tasks is moving to Cowork (preview). Privacy controls differ between the old and updated app. | 18 Aug 2026 | https://support.microsoft.com/en-gb/microsoft-365-copilot/learning/changes-microsoft-copilot-app |
| Gemini | Gems will be removed for personal Google Accounts in November 2026 and replaced by skills. The typed trigger for skills is changing from `/` to `@`. | Nov 2026 | https://support.google.com/gemini/answer/18560919?hl=en-GB |
| Gemini | The activity setting is now called **Keep activity**. | Current | https://support.google.com/gemini/answer/13278892?hl=en-GB |
| Claude | Chat and Cowork are merging into one experience, rolling out gradually to Pro and Max. Memory reached free users on 2 March 2026. | 16 Sep 2026 | https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude; https://support.claude.com/en/articles/12138966-release-notes |
| Perplexity | Spaces are now Projects, threads are now sessions, Pages is temporarily retired, and the settings page says Shortcuts have moved to Skills. | 2026 | https://www.perplexity.ai/help-center/en/articles/10352993-account-settings |

## 2. ChatGPT

### 2.1 Slash commands (typing `/`)

| Claim | Status | Evidence (paraphrased) | URL and date | Plan and platform |
|---|---|---|---|---|
| Typing `/` in the message box opens a tool menu from which you can pick **Search**. | VERIFIED (PM) | The web search article gives this as an alternative to choosing Search from the tools list. | https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt (about Aug 2026) | Web search is on all plans. The slash menu is described for the composer without a platform note. In a logged-out browser session on 13 Oct 2026, typing `/` opened no menu, so treat it as signed-in only. Mobile not confirmed. |
| Typing `/Deepresearch` starts a deep research task. | VERIFIED (PM) | Listed as one of three ways to start, with the tools menu (+) and the sidebar. | https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt (about 21 Sep 2026) | Signed in. Usage allowance varies by plan. Platform not stated. |
| Typing `/agent` starts agent mode. | RETIRED | Still in the body of the agent article, but the banner at the top says the agent is no longer available. | https://help.openai.com/en/articles/11752874-chatgpt-agent (about 15 Sep 2026) | None. |
| `/canvas`, `/image`, `/reason` and similar tool names. | UNVERIFIED | Not found in any current help article read. Canvas itself is removed. | Not applicable | Not applicable |
| A complete official list of what the `/` menu shows. | UNVERIFIED | No help article lists the full menu. Only Search and Deepresearch are documented. | Not applicable | Not applicable |

### 2.2 At mentions (typing `@`)

| Claim | Status | Evidence (paraphrased) | URL and date | Plan and platform |
|---|---|---|---|---|
| `@` brings a custom GPT into the current chat. | VERIFIED (PM), RETIRING | Works on ChatGPT web. The article says the flow is not available in the iOS or Android apps. GPTs retire 11 Dec 2026. | https://help.openai.com/en/articles/8554407-gpts-in-chatgpt (about 28 Sep 2026) | Web only. Signed in. |
| `@` selects an installed plugin or connected app. | VERIFIED (PM) | The plugins article says a plugin can be selected with an @ mention, or from + or the Plugins control. The connected apps article says the same for apps. | https://help.openai.com/en/articles/20001256-plugins-in-chatgpt (about 10 Oct 2026); https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt (about 11 Oct 2026) | The plugin directory is on all plans. Individual plugins depend on plan, region and workspace. |
| `@` references a file. | UNVERIFIED | Not found. | Not applicable | Not applicable |

### 2.3 Hash (typing `#`)

| Claim | Status | Evidence |
|---|---|---|
| `#` does something as a ChatGPT feature (tags, files, memory). | MYTH / UNVERIFIED | Nothing found in the help centre. A help centre search for hashtag returned only unrelated articles. |
| `#` and `###` are useful as formatting inside a prompt. | VERIFIED | See section 8. OpenAI recommends Markdown headers, and `###` as a separator. |

### 2.4 Keyboard shortcuts

| Shortcut | Status | Evidence (paraphrased) | URL and date | Platform |
|---|---|---|---|---|
| `Ctrl+K` (Windows) or `Cmd+K` (Mac) opens Search. | VERIFIED (PM) | Stated in the article on finding chats, projects and files. | https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt (about 19 Sep 2026) | Web. Search itself is on all plans. |
| `Cmd+/` or `Ctrl+/` shows the full shortcut list. | VERIFIED only in a 2023 note | The 3 August 2023 release note says so, alongside a shortcut for copying the last code block. No current article repeats it. In a logged-out browser on 13 Oct 2026, neither key combination opened a list. | https://help.openai.com/en/articles/6825453-chatgpt-release-notes | Web, signed in (assumed). Treat as needing a test before print. |
| New chat, focus input, copy last reply, toggle sidebar, temporary chat shortcut. | UNVERIFIED | Widely repeated online (for example `Ctrl+Shift+O` for new chat), but not in any current OpenAI help article read. | Not applicable | Not applicable |
| `Option+Space` opens the Chat Bar (Mac desktop app). | VERIFIED (PM), but see note | The Chat Bar article and the macOS download article both state it, and say it can be changed in Settings. It is unclear whether this describes the new app or ChatGPT Classic. | https://help.openai.com/en/articles/9295241-how-to-launch-the-chat-bar (about Jul 2026) | Mac desktop app. |
| `Alt+Space` opens the companion window (Windows desktop app). | VERIFIED (PM), but stale page | The Windows article states it. The same page still describes an early version for paid plans, so it predates the new app. | https://help.openai.com/en/articles/9982051-using-the-chatgpt-windows-app (about Aug 2026) | Windows desktop app. |
| `Cmd+Shift+B` or `Ctrl+Shift+B` opens the built-in browser. | VERIFIED | Stated in the built-in browser article. | https://help.openai.com/en/articles/20001277-using-the-built-in-browser-in-the-chatgpt-desktop-app (about 1 Oct 2026) | New desktop app. |
| Voice or dictation keyboard shortcut. | UNVERIFIED | The Work article says a Voice shortcut can be configured in Settings on desktop. No default key is documented. | https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex | Desktop app. |

### 2.5 Features a small business would call shortcuts

| Feature | What it is | Status | Plan | Where to find it | URL and date |
|---|---|---|---|---|---|
| Custom instructions | Standing instructions applied to every chat. | VERIFIED (PM) | All plans. Free and Go: 1,500 characters. Paid: 5,000. | Web and desktop: Settings, **Personalization**. iOS and Android: Settings, **Customize ChatGPT**. | https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions (about Aug 2026) |
| Memory | Remembers preferences and details across chats. You can ask what it remembers. | VERIFIED (PM) | Varies by plan and region (the article says so). | Settings, **Personalization**, **Memory**. | https://help.openai.com/en/articles/8590148-memory-faq (about 19 Sep 2026) |
| Projects | Keeps related chats, files and instructions together. | VERIFIED (PM) | Free (5 files per project) and paid. Sharing on all plans. | **New project** in the sidebar. Instructions under Project settings. | https://help.openai.com/en/articles/10169521-projects-in-chatgpt (about 19 Sep 2026) |
| Custom GPTs | Tailored versions of ChatGPT. | RETIRING 11 Dec 2026 | Creation closed on personal accounts. | Not applicable | https://help.openai.com/en/articles/20001519-custom-gpt-retirement-and-migration-faq |
| Plugins (replacement for GPTs and the app directory) | Bundles of instructions, apps and skills. | VERIFIED (PM) | Directory on all plans. Each plugin varies by plan and region. | **Plugins** in the sidebar (web, desktop, mobile). | https://help.openai.com/en/articles/20001256-plugins-in-chatgpt (about 10 Oct 2026) |
| Skills | Reusable instructions and steps. | VERIFIED (PM) | Business, Enterprise, Healthcare and Edu only. Not personal plans. | Skills page. | https://help.openai.com/en/articles/20001066-skills-in-chatgpt |
| Scheduled tasks | One-off or recurring tasks and reminders. | VERIFIED (PM) | Free: up to three active tasks, at most once a day. More on paid plans. Event-triggered tasks need Plus or above. | **Scheduled** in the sidebar. Notifications under Settings, Notifications. | https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt (about 1 Oct 2026); release notes 17 Jun and 25 Aug 2026 |
| Temporary chat | A chat kept out of history and not used for training while temporary. Can be personalised or not, and can be saved later. | VERIFIED (PM) | Plan not stated in the article. | Open a new chat, select **Temporary**. | https://help.openai.com/en/articles/8914046-temporary-chat-in-chatgpt (about 19 Sep 2026) |
| Voice | Spoken conversation. | VERIFIED (PM) | All plans. Free has limited access. | The Voice icon in the message bar (iOS, Android) or prompt window (web). | https://help.openai.com/en/articles/20001274-chatgpt-voice (about 25 Sep 2026) |
| Dictation | Speak instead of type. | VERIFIED | All plans (release note 26 Jun 2026). | The microphone icon. | https://help.openai.com/en/articles/12168547-voice-dictation-faq (about Aug 2026) |
| Photo or camera upload | Ask questions about a photo or screenshot. | VERIFIED (PM) | Free and paid, with limits. | The **+** icon, then **Add photos & files**. Multi-page **Scan** in the camera is rolling out on iOS (1 Oct 2026). | https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq (about Aug 2026) |
| File upload | Documents, spreadsheets, presentations. Audio on paid plans. | VERIFIED (PM) | Free and paid. Free is limited to three file uploads a day. | Attach in the composer. | https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt (about 8 Oct 2026) |
| Library | Saved files you can reuse. | VERIFIED (PM) | All plans, including the UK. Free has 500 MB. | Library on web. | https://help.openai.com/en/articles/20001052-using-library-to-manage-files-in-chatgpt (about 3 Oct 2026) |
| Connected apps (Gmail, Google Calendar, Google Drive, Outlook) | Lets ChatGPT read and act in other services. | VERIFIED that they exist. UNVERIFIED for UK personal plans. | The article says availability depends on app, plan, region and interface. | Settings, **Apps**, or `@` in a chat. | https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt (about 11 Oct 2026) |
| Deep research | Multi-step research with a cited report. | VERIFIED (PM) | Signed in. Allowance varies by plan. | Tools menu (+), sidebar, or `/Deepresearch`. | https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt |
| Agent mode | Was an agent that carried out tasks. | RETIRED | Replaced by Work, paid plans only. | Chat or Work toggle. | https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex (about 10 Oct 2026) |
| Canvas | Was a side-by-side editor. | RETIRED from current models | Replaced by writing blocks and code blocks. | Inside the reply. | https://help.openai.com/en/articles/20001246-working-with-writing-blocks-and-code-blocks-in-chatgpt (about 6 Oct 2026) |
| Image generation | Create and edit images. | VERIFIED (PM) | All tiers. Web, iOS, Android. | Ask in chat, or Images in the sidebar. | https://help.openai.com/en/articles/11084440-images-in-chatgpt |
| Share links | A link to a snapshot of a chat or a scheduled task. | VERIFIED (PM) | Personal accounts. Anyone with the link can open it. | **Share**, then create or copy the link. | https://help.openai.com/en/articles/7925741-sharing-conversations-and-scheduled-tasks-in-chatgpt (about 19 Sep 2026) |
| Regenerate | Try a reply again. | VERIFIED in passing | Not stated. | The refresh control under a reply, then Try again. | https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt |
| Edit a sent message | Change a prompt after sending. | UNVERIFIED | Not found in the articles read. | Not applicable | Not applicable |
| Branch a conversation | Start a new chat from an earlier point. | VERIFIED (PM) | Web. Plan not stated. | Hover a message, More actions, **Branch in new chat**. | Release notes, 4 Sep 2025 |
| Chat search | Search chats, projects and files. | VERIFIED (PM) | All plans. Web, iOS, Android. | Sidebar search, or `Ctrl+K` / `Cmd+K` on web. | https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt |
| Pinned chats | Keep a chat at the top of the list. | VERIFIED (PM) | Plan not stated. Web, iOS, Android. | Web: hover the chat, the three dots, **Pin chat**. Mobile: long-press, **Pin chat**. | Release notes, 18 Dec 2025 and 18 Jun 2026 |

### 2.6 Privacy controls

| Item | Detail | Status | URL and date |
|---|---|---|---|
| Stop chats being used for training | Turn off **Improve the model for everyone**. Web: account menu, Settings, **Data controls**. iOS and Android: sidebar, profile icon, Settings, Data controls. Applies across devices when signed in. | VERIFIED (PM) | https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt (about 28 Sep 2026) |
| Alternative opt-out | The **Do not train on my content** request in the OpenAI Privacy Portal has the same effect. | VERIFIED | https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance (12 Oct 2026) |
| Feedback loophole | After opting out, a thumbs up or thumbs down can still put that whole conversation into training. | VERIFIED (PM) | Data controls article, FAQ section |
| Connected apps | For personal plans, information read from connected apps can be used for training if the setting is on. | VERIFIED | https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt |
| Business workspaces | Business, Enterprise and Edu content is not used for training by default. | VERIFIED (PM) | Data controls article |
| Temporary chat | Not in history, no new memories, not used for training while temporary. A copy may be kept for up to 30 days for safety. If saved, it becomes a normal chat and follows the account setting. | VERIFIED (PM) | https://help.openai.com/en/articles/8914046-temporary-chat-in-chatgpt |
| Retention | A deleted chat is removed from view at once and scheduled for permanent deletion within 30 days, with security and legal exceptions. | VERIFIED (PM) | https://help.openai.com/en/articles/8983778-chat-and-file-retention-in-chatgpt (about 22 Sep 2026) |
| Privacy Center | A place that explains the options and links to the settings. Web: account menu, Help, Privacy Center. | VERIFIED (PM) | https://help.openai.com/en/articles/20001488-privacy-center-in-chatgpt (about 22 Sep 2026) |
| UK specific | Adverts on Free and Go in the UK since 4 June 2026. Personalisation is controlled in Settings, **Ad Controls**. OpenAI says it does not share conversations with advertisers. | VERIFIED | https://help.openai.com/en/articles/20001047-ads-in-chatgpt (about 28 Sep 2026) |

## 3. Microsoft Copilot

Naming note: Microsoft support pages now use Microsoft Copilot for the free chat, the personal Microsoft 365 plans (Personal, Family, Premium, Pro) and work accounts alike. An updated app replaced the consumer app from 18 August 2026, and several pages state which version they describe.

### 3.1 Slash, at and hash

| Claim | Status | Evidence (paraphrased) | URL and date | Plan and platform |
|---|---|---|---|---|
| Typing `/` then a name points Copilot at a specific file, person or meeting. | VERIFIED (PM) | In the getting started article under writing prompts, and in the article on referring to specific files. | https://support.microsoft.com/en-gb/microsoft-365-copilot/get-started-with-microsoft-365-copilot-chat; https://support.microsoft.com/en-gb/microsoft-365-copilot/refer-to-specific-files-and-more-in-microsoft-365-copilot (no date shown) | Needs sign-in with a Microsoft 365 account. Without a Copilot licence only files can be referenced. Behaviour on a free personal account is not stated. |
| `@` mentions an agent. | UNVERIFIED | Not found in the agents article or any Copilot page read. | Not applicable | Not applicable |
| `#` does something. | UNVERIFIED | Not found. | Not applicable | Not applicable |

### 3.2 Keyboard shortcuts

| Shortcut | Status | Evidence | URL |
|---|---|---|---|
| The Copilot key, or `Windows key + C`, opens Copilot on Windows. Behaviour (full app or quick view) is set under Account, Settings, **Copilot Keyboard Shortcuts**. | VERIFIED (PM) | Access article for Windows. | https://support.microsoft.com/en-gb/microsoft-365-copilot/access-microsoft-365-copilot-on-windows (no date shown) |
| `Option + Spacebar` opens Copilot on a Mac. Changeable under Account, **Keyboard Shortcut**. | VERIFIED (PM) | macOS article. | https://support.microsoft.com/en-gb/microsoft-365-copilot/getting-started-with-copilot-on-macos (no date shown) |
| Saying "Hey Copilot" starts a voice chat on Windows. Off by default. | VERIFIED | Wake word article. | https://support.microsoft.com/en-gb/microsoft-365-copilot/how-hey-copilot-wake-word-works-in-microsoft-365-copilot (Oct 2026) |
| `Alt + Space` for Copilot on Windows. | UNVERIFIED | Not in the current access article. | Not applicable |
| New chat, copy last reply, sidebar shortcuts. | UNVERIFIED | Not found. | Not applicable |

### 3.3 Features

| Feature | Detail | Status | Plan | URL |
|---|---|---|---|---|
| Custom instructions | Settings and more (three dots), Personalization, **Edit instructions**. | VERIFIED (PM) | Not stated. | https://support.microsoft.com/en-gb/microsoft-365-copilot/customize-how-microsoft-365-copilot-responds-to-you |
| Memory | Settings, Personalization, **Saved memories** toggle and Manage. | VERIFIED (PM) | Not stated. | https://support.microsoft.com/en-gb/privacy/microsoft-copilot/privacy-controls |
| Connectors | OneDrive, Outlook.com (email, calendar, contacts), Gmail, Google Calendar and Contacts, Google Drive. Profile, **Connectors**. | VERIFIED (PM) | Article says it applies to personal accounts on Microsoft 365 Personal, Family, Premium and Pro. It still describes copilot.com, so it may predate the updated app. | https://support.microsoft.com/en-gb/microsoft-copilot/connecting-microsoft-copilot-to-other-services |
| Scheduled prompts | Hover a prompt, **Schedule this prompt**. | VERIFIED (PM) | Needs a Microsoft Copilot licence. | https://support.microsoft.com/en-gb/microsoft-365-copilot/schedule-your-most-used-copilot-prompts |
| Conversation modes | Quick response, Think Deeper, Smart, Study and learn. | VERIFIED (PM) | All users, priority for subscribers. | https://support.microsoft.com/en-gb/microsoft-365-copilot/conversation-modes-in-microsoft-copilot |
| File upload | The **+** icon, **Add images or files**. | VERIFIED (PM) | All experiences. | https://support.microsoft.com/en-gb/microsoft-365-copilot/file-upload-in-microsoft-copilot |
| Share link | **Share**, **Share chat**, Copy link. | VERIFIED (PM) | Not stated. | https://support.microsoft.com/en-gb/microsoft-365-copilot/share-conversations-responses-in-microsoft-copilot |
| Image generation | Ask in chat. | VERIFIED | Free, subject to capacity and limits (stated in the app update article). | https://support.microsoft.com/en-gb/microsoft-copilot/using-image-generation-in-microsoft-copilot; https://support.microsoft.com/en-gb/microsoft-365-copilot/learning/changes-microsoft-copilot-app |
| Voice | Speak to Copilot. The article says voice needs an eligible subscription and varies by region. | VERIFIED (PM) | Eligible subscription. | https://support.microsoft.com/en-gb/microsoft-365-copilot/get-started-with-voice-features-in-microsoft-365-copilot (Oct 2026) |
| Pages, Notebooks | Editable documents and notebooks built from chats. | VERIFIED (PM) | Microsoft 365 Personal, Family, Premium or Pro for personal accounts. | https://support.microsoft.com/en-gb/microsoft-365-copilot/get-started-with-microsoft-365-copilot-pages |
| Researcher | Long research reports. | VERIFIED (PM) | Microsoft 365 Premium and Pro. | https://support.microsoft.com/en-gb/microsoft-365-copilot/get-started-with-researcher-in-microsoft-365-copilot |
| Cowork | Hands a multi-step task to Copilot. | VERIFIED, preview | Personal and work accounts. | https://support.microsoft.com/en-gb/microsoft-365-copilot/get-started-with-cowork |
| Deep Research, Podcasts, Group Chat | Consumer features. | RETIRED from 18 Aug 2026 | None. | https://support.microsoft.com/en-gb/microsoft-copilot/deep-research-in-microsoft-copilot |
| Temporary or private chat | An equivalent to temporary chat. | UNVERIFIED | Not found. | Not applicable |

### 3.4 Privacy controls

| Item | Detail | Status | URL |
|---|---|---|---|
| Updated app (from 18 Aug 2026) | Microsoft states that prompts, responses and file contents in the app are not used to train foundation models. There is no training switch to set. Controls sit under Settings, **Personalization**: Saved memories, One shared experience, Web search, Allow ads personalization. | VERIFIED (PM) | https://support.microsoft.com/en-gb/privacy/microsoft-copilot/activity-history; https://support.microsoft.com/en-gb/privacy/microsoft-copilot/privacy-controls |
| Older app | Profile, **Privacy**, then **Training on conversation activity** and **Training on voice conversations**. The page says it now applies only to the older app. | VERIFIED (PM) | https://support.microsoft.com/en-gb/microsoft-copilot/microsoft-copilot-privacy-controls |
| Retention | Older documentation: conversation history kept for 18 months by default, uploaded files no longer than 18 months. No retention period was found for the updated app. | VERIFIED for the older app | https://support.microsoft.com/en-gb/microsoft-copilot/privacy-faq-for-microsoft-copilot |
| Adverts | Free users may see adverts. Personalised adverts can be switched off. | VERIFIED (PM) | Privacy controls article |
| UK specific | Nothing UK specific found. One setting (importing Edge browser data) is limited to accounts based in the United States. | Not applicable | Privacy controls article |

## 4. Google Gemini

### 4.1 Slash, at and hash

| Claim | Status | Evidence (paraphrased) | URL | Plan and platform |
|---|---|---|---|---|
| Typing `@` and picking an app tells Gemini which connected app to use (for example `@Google Calendar`). | VERIFIED (PM) | Connected Apps article and the Calendar article. | https://support.google.com/gemini/answer/13695044?hl=en-GB; https://support.google.com/gemini/answer/15305236?hl=en-GB (no date shown) | Signed in. Apps vary by device, country and account. Needs **Keep activity** on for Google Workspace apps. |
| Typing `/` then a skill name uses a skill. | VERIFIED (PM), but CHANGING | Both skills articles say the trigger is `/` now and will become `@`. Some accounts already have `@`. | https://support.google.com/gemini/answer/17094296?hl=en-GB; https://support.google.com/gemini/answer/18560919?hl=en-GB | Personal accounts, aged 18 or over, rolling out. Mobile app, Mac app and web. |
| `#` does something. | UNVERIFIED | Only appears as hashtags in an example output. | Not applicable | Not applicable |

### 4.2 Keyboard shortcuts

| Shortcut | Status | URL |
|---|---|---|
| `Option + Space` opens the Gemini window on Mac (app installed and running). Customisable. | VERIFIED (PM) | https://support.google.com/gemini/answer/17011627?hl=en-GB |
| `Alt + Space` opens Gemini on Windows (app installed). | VERIFIED (PM) | https://support.google.com/gemini/answer/18263854?hl=en-GB |
| Shortcuts inside the web app (new chat and so on). | UNVERIFIED | Not found in the help pages read. |

### 4.3 Features

| Feature | Detail | Status | Plan | URL |
|---|---|---|---|---|
| Instructions for Gemini (custom instructions) | Settings and help, **Personal context**, then add under your instructions for Gemini. | VERIFIED (PM) | All users. | https://support.google.com/gemini/answer/16598625?hl=en-GB |
| Memory (asking it to remember) | Remembers facts across chats. | VERIFIED, not UK | The article says US only for now, and needs a Google AI plan. | Same article |
| Gems | Custom assistants. | RETIRING Nov 2026 (personal accounts) | Not applicable | https://support.google.com/gemini/answer/18560919?hl=en-GB |
| Skills | Reusable instructions, replacing Gems. | VERIFIED (PM) | Personal accounts, 18 or over, rolling out. | https://support.google.com/gemini/answer/17094296?hl=en-GB |
| Scheduled actions | Recurring prompts. Up to 10 active. | VERIFIED (PM) | Being made available to all personal accounts. | https://support.google.com/gemini/answer/16316416?hl=en-GB |
| Tasks | Multi-step work in Gmail and other apps. | VERIFIED (PM) | Google AI Pro or Ultra. | https://support.google.com/gemini/answer/17094507?hl=en-GB |
| Temporary chat | A chat that does not appear in activity or recent chats. | VERIFIED in US English only | Personal accounts, web or mobile app. | https://support.google.com/gemini/answer/13275745?hl=en#temp_chats |
| Gemini Live (voice) | Spoken conversation with camera and screen sharing. | VERIFIED (PM) | Mobile app. Not in the web app. | https://support.google.com/gemini/answer/15274899?hl=en-GB |
| File and photo upload | Add files under the text box. | VERIFIED | Free with limits, higher on paid plans. | https://support.google.com/gemini/answer/14903178?hl=en-GB |
| Connected apps | Gmail, Docs, Drive, Calendar, Keep, Tasks. | VERIFIED | Needs Keep activity on. | https://support.google.com/gemini/answer/15229592?hl=en-GB |
| Deep Research | Research report built from Google Search and other sources you add. | VERIFIED | All users aged 18 or over, higher limits on Pro and Ultra. | https://support.google.com/gemini/answer/15719111?hl=en-GB |
| Canvas | Side-by-side document or app editor. | VERIFIED | Signed in. | https://support.google.com/gemini/answer/16047321?hl=en-GB |
| Image generation | Described as using Nano Banana 2. | VERIFIED (PM) | 18 or over. | https://support.google.com/gemini/answer/14286560?hl=en-GB |
| Share links | Creates a public link anyone can read. | VERIFIED (PM) | 18 or over. | https://support.google.com/gemini/answer/13743730?hl=en-GB |
| Regenerate | Only the most recent reply can be regenerated. | VERIFIED (PM) | Signed in. | https://support.google.com/gemini/answer/14262426?hl=en-GB |
| Pinned chats | Side panel, More, **Pin**. | VERIFIED (PM) | Signed in. | https://support.google.com/gemini/answer/13666746?hl=en-GB |

### 4.4 Privacy controls

| Item | Detail | Status | URL |
|---|---|---|---|
| Stop chats being used for training | Turn off **Keep activity**: gemini.google.com, **Activity**, then Turn off (or Turn off and delete activity). On by default for adults. | VERIFIED (PM) | https://support.google.com/gemini/answer/13278892?hl=en-GB |
| What still happens when it is off | Chats are still kept for up to 72 hours to run the service. Feedback you submit can still be used. Some connected apps stop working. | VERIFIED (PM) | Same, and the Privacy Hub |
| Retention | Auto-delete defaults to 18 months. It can be set to 3 months, 36 months or never. Chats seen by human reviewers are kept for up to three years and are not removed when you delete your activity. | VERIFIED (PM) | https://support.google.com/gemini/answer/13594961?hl=en-GB (last updated 13 October 2026) |
| Human review | Google warns users not to enter confidential information they would not want a reviewer to see. | VERIFIED (PM) | Privacy Hub |
| Temporary chat | Kept for 72 hours and not used to train Google's models. | VERIFIED (PM) | Privacy Hub |
| UK specific | The Privacy Hub has a section on legal bases under UK data protection law. The UK English help page for using Gemini has no temporary chat section, while the US English page does. | VERIFIED as a gap | https://support.google.com/gemini/answer/13275745?hl=en-GB |

## 5. Claude

### 5.1 Slash, at and hash

| Claim | Status | Evidence (paraphrased) | URL and date | Plan and platform |
|---|---|---|---|---|
| Typing `/` (or clicking +) lists the skills that come with your plugins. | VERIFIED (PM) | Plugins article. | https://support.claude.com/en/articles/13837440-use-plugins-in-claude (updated the week of 13 Oct 2026) | Paid plans (plugins need Pro or above). Chat on web, Claude Desktop and Cowork. |
| Typing `/deep-research` starts Research. | VERIFIED (PM) | Listed in the article on the merged chat and Cowork experience. | https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude (over 3 weeks before 13 Oct 2026) | New experience, rolling out to Pro and Max. |
| Typing `/schedule` in a Cowork task sets up a scheduled task. | VERIFIED (PM) | Cowork getting started article. | https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork | Paid plans. |
| `@` mentions. | UNVERIFIED | Not found in any Claude help page read. | Not applicable | Not applicable |
| `#` does something. | UNVERIFIED | Not found. | Not applicable | Not applicable |

### 5.2 Keyboard shortcuts

| Shortcut | Status | URL and date |
|---|---|---|
| Double-tap `Option` opens quick entry on a Mac. Managed in Settings, General. | VERIFIED (PM) | https://support.claude.com/en/articles/12626668-use-quick-entry-with-claude-desktop-on-mac (16 March 2026). All plans, macOS desktop app. |
| `Caps Lock` starts dictation in quick entry (off by default). | VERIFIED (PM) | Same article. macOS 14 or later. |
| Web app shortcuts (new chat, sidebar, and so on). | UNVERIFIED | No general shortcut article found. Only Claude Docs and Slides have shortcut pages. |

### 5.3 Features

| Feature | Detail | Status | Plan | URL and date |
|---|---|---|---|---|
| Instructions for Claude | Account-wide instructions. Click your initials (lower left), Settings. | VERIFIED (PM) | Not stated. | https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features |
| Projects | Group chats and files. | VERIFIED (PM) | All users. Free: up to five projects. Project instructions are described as paid only. | Same article |
| Skills | Reusable behaviours and expertise. Customize, Skills. | VERIFIED (PM) | All plans. Needs code execution switched on. | https://support.claude.com/en/articles/12512176-what-are-skills |
| Memory | Remembers across chats. Settings, Memory. | VERIFIED (PM) | On by default for Free, Pro and Max. Searching past chats is paid only. | https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context |
| Incognito chat | Not saved to history or memory, not used for training. The ghost icon, top right of a new chat. | VERIFIED (PM) | All plans. | https://support.claude.com/en/articles/12260368-use-incognito-chats |
| Voice mode | Beta. Sound wave symbol in the chat box. | VERIFIED (PM) | All plans. Mobile, desktop and web. | https://support.claude.com/en/articles/11101966-use-voice-mode |
| Dictation | Speak to type on mobile. | VERIFIED (PM) | All plans. | https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile (23 July 2026) |
| Connectors | Gmail, Google Calendar, Google Drive, Microsoft 365. Customize, **Connectors**. | VERIFIED (PM) | All plans. | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors; https://support.claude.com/en/articles/15183774-connect-to-microsoft-365 (8 September 2026) |
| Research | Multi-search research with citations. | VERIFIED (PM) | Paid plans. | https://support.claude.com/en/articles/11088861-use-research-on-claude (2 June 2026) |
| Scheduled tasks | Recurring tasks. | VERIFIED (PM) | Paid plans. | https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork |
| Artifacts and file creation | Documents, spreadsheets, slides, visuals. | VERIFIED (PM) | All plans. | https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them |
| Image generation | Claude does not generate photos or illustrations. It can read uploaded images. | VERIFIED (PM) | Not applicable | https://support.claude.com/en/articles/9002504-can-claude-produce-images (16 March 2026) |
| Share links | Public link to a snapshot. | VERIFIED (PM) | Free, Pro and Max. | https://support.claude.com/en/articles/16762437-public-links-for-shared-chats |
| Styles | Preset writing styles. | UNVERIFIED | The current personalisation article does not mention them. | Not applicable |

### 5.4 Privacy controls

| Item | Detail | Status | URL and date |
|---|---|---|---|
| Stop chats being used for training | Settings, **Privacy**, then switch off the toggle under **Help Improve our AI models**. Same path on mobile. | VERIFIED (PM) | https://privacy.claude.com/en/articles/12109829-how-do-i-change-my-model-improvement-privacy-settings (3 August 2026) |
| Exceptions | Conversations flagged for safety review can still be used. Thumbs up or down feedback stores the whole conversation for up to five years. | VERIFIED (PM) | https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training (16 March 2026) |
| Retention | Deleted chats leave back-end systems within 30 days. If training is allowed, data may be kept de-identified for up to five years. Flagged content: up to two years, and safety scores up to seven. | VERIFIED (PM) | https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data (1 July 2026) |
| Incognito | Never used for training, kept 30 days by default. | VERIFIED (PM) | Incognito article |
| UK specific | Nothing UK specific found. | Not applicable | Not applicable |

## 6. Perplexity

| Claim | Status | Evidence (paraphrased) | URL and date |
|---|---|---|---|
| Typing `/` in the Comet browser lists saved shortcuts (reusable prompts) that you can create yourself. | VERIFIED (PM), but CONTRADICTED | The Comet Shortcuts article describes this. The account settings article says Shortcuts have moved to Skills. | https://www.perplexity.ai/help-center/en/articles/11897890-comet-shortcuts (14 Sep 2026); https://www.perplexity.ai/help-center/en/articles/10352993-account-settings (3 Sep 2026) |
| `@` mentions point a prompt at a source. | VERIFIED in passing | One line in the Comet Shortcuts article. No fuller explanation found. | Same |
| `#` does something. | UNVERIFIED | Not found. | Not applicable |
| Keyboard shortcuts. | UNVERIFIED | Settings has a display option for shortcut hints, but no list was found. | Account settings article |
| Custom instructions | VERIFIED (PM) | Settings, Personalization, **Custom instructions**. | Account settings article |
| Memory | VERIFIED (PM) | Settings, Memory, with separate toggles. | https://www.perplexity.ai/help-center/en/articles/10968016-memory (14 Sep 2026) |
| Projects (formerly Spaces) | VERIFIED (PM) | Projects in the left sidebar, **New project**. | https://www.perplexity.ai/help-center/en/articles/10352961-what-are-projects (13 Oct 2026) |
| Scheduled searches and scheduled tasks | VERIFIED (PM) | Settings, Notifications, to create a scheduled search. Scheduled tasks run in Computer, which needs a subscription. | Account settings; https://www.perplexity.ai/help-center/en/articles/11521526-perplexity-tasks (21 Sep 2026) |
| Research mode | VERIFIED (PM) | Free users get limited access. | https://www.perplexity.ai/help-center/en/articles/10738684-what-is-research-mode (3 Sep 2026) |
| File upload | VERIFIED (PM) | The attach button in the search bar. Weekly allowance on every plan. | https://www.perplexity.ai/help-center/en/articles/10354807-file-uploads (7 Sep 2026) |
| Connectors (Gmail with Calendar, Outlook.com) | VERIFIED | Settings, Connectors. Plan not stated. | https://www.perplexity.ai/help-center/en/articles/12168040-connecting-perplexity-with-gmail-and-google-calendar |
| Pages | RETIRED for now | The Pages article says the create page feature is temporarily retired. | https://www.perplexity.ai/help-center/en/articles/10352968-perplexity-pages |

Privacy:

| Item | Detail | Status | URL and date |
|---|---|---|---|
| Stop chats being used for training | Account settings, **Preferences**, switch off **AI data retention**. On by default for Free, Pro and Max. Only affects data collected after the change. | VERIFIED (PM) | https://www.perplexity.ai/help-center/en/articles/11564572-data-collection-at-perplexity (3 Sep 2026) |
| Incognito | Incognito sessions expire within 24 hours and cannot be recovered. | VERIFIED (PM) | https://www.perplexity.ai/help-center/en/articles/12639758-incognito-mode-troubleshooting (5 Sep 2026) |
| Third-party models | Perplexity says its agreements stop model providers training on Perplexity data. | VERIFIED (PM) | https://www.perplexity.ai/help-center/en/articles/10354963-are-third-party-model-providers-training-on-my-data (14 Sep 2026) |
| Retention | Sessions stay in history until you delete them. | VERIFIED (PM) | https://www.perplexity.ai/help-center/en/articles/10354769-what-is-a-thread |

## 7. Meta AI inside WhatsApp

| Claim | Status | Evidence (paraphrased) | URL |
|---|---|---|---|
| Typing `/reset-ai` in a chat with Meta AI deletes Meta AI's copy of that chat's messages and information. | VERIFIED | Listed under commands in the article on deleting chats with Meta AI. | https://faq.whatsapp.com/688464770796037 (no date shown) |
| Typing `/reset-all-ais` does the same for every individual and group chat where you used Meta AI. | VERIFIED | Same article. | Same |
| Mentioning `@Meta AI` in a chat is how Meta AI is brought in. Only messages that mention it, or that someone shares with it, can be read by Meta. | VERIFIED | Stated in the About Meta AI article and the AI experiences article. A step-by-step for group chats was not found. | https://faq.whatsapp.com/2257017191175152; https://faq.whatsapp.com/1111412106858632 |
| `/imagine` creates an image. | UNVERIFIED | Not in current WhatsApp help. Images are created by describing them to Meta AI, or from the attachment menu, **AI images**. | https://faq.whatsapp.com/666225138813752 |
| Forward a message to Meta AI with a question. | VERIFIED | Described in the how to chat article. | https://faq.whatsapp.com/666767195111959 |
| Meta AI can be switched off in WhatsApp. | UNVERIFIED | Not found. The help pages call it optional, meaning you choose whether to message it. | Not applicable |
| Available in the UK. | UNVERIFIED | The help pages say it is available in limited countries and name none. A UK reader of the page is linked to UK-specific AI terms, which suggests but does not prove availability. | https://faq.whatsapp.com/1303130641622232 |

Privacy:

| Item | Detail | Status | URL |
|---|---|---|---|
| What Meta receives | Your prompts, the messages you share with it, and feedback. Personal chats stay end-to-end encrypted. WhatsApp advises not sending Meta AI anything you do not want it to know. | VERIFIED | https://faq.whatsapp.com/1002544104126998 |
| Training | Meta's Privacy Centre lists your interactions with its AI features among its training sources. It says private messages with friends and family are not used unless someone in the chat shares them with the AI. | VERIFIED | https://www.facebook.com/privacy/genai |
| UK route to object | There is no in-app switch. Meta says you have a right to object and can submit an objection request, including through your WhatsApp account for your messages with AIs on WhatsApp. | VERIFIED (shown to a UK reader) | Same |
| Retention | No retention period found. | UNVERIFIED | Not applicable |

## 8. Formatting devices recommended in vendors' own prompt guides

| Device | Vendor guidance | Status | URL and date |
|---|---|---|---|
| `###` or triple quotes (`"""`) to separate the instruction from pasted text | OpenAI's help centre rule of thumb number 2 says to put instructions first and use either mark as the separator. | VERIFIED (PM) | https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api (about Aug 2026) |
| Markdown headings (`#`) and lists | OpenAI's developer guide says Markdown headers and lists help mark distinct sections and show hierarchy. Google's guide says Markdown headings work as delimiters. | VERIFIED (PM) | https://developers.openai.com/api/docs/guides/prompt-engineering (platform.openai.com/docs redirects here, no date shown); https://ai.google.dev/gemini-api/docs/prompting-strategies (last updated 13 Oct 2026) |
| XML-style tags (for example a context tag and a task tag) | OpenAI: tags help show where a supporting document starts and ends. Anthropic: tags help Claude parse prompts that mix instructions, context and examples. Google: tags or Markdown headings both work, pick one and stay consistent. | VERIFIED (PM) | OpenAI and Google as above; https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices (no date shown) |
| Numbered steps | Anthropic: give instructions as numbered or bulleted steps when order matters. | VERIFIED (PM) | Anthropic guide above |
| Triple backticks | Not found as delimiter advice in the guides read. OpenAI's developer guide mentions backticks only for formatting code in answers. | UNVERIFIED | Not applicable |
| Goal, Context, Source, Expectations | Microsoft's four-part prompt recipe. No delimiter advice. | VERIFIED (PM) | https://support.microsoft.com/en-gb/microsoft-365-copilot/get-started-writing-prompts-in-microsoft-365-copilot (September 2026) |
| Be specific, add context, use the key terms | Perplexity's tips. No delimiter advice. | VERIFIED | https://www.perplexity.ai/help-center/en/articles/13645819-tips-for-getting-better-answers-from-perplexity (3 Sep 2026) |
| Plain, specific, iterative prompts | OpenAI's ChatGPT prompt guide: be clear and specific, refine in rounds, name the tone you want. | VERIFIED (PM) | https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt (about Aug 2026) |

## 9. Viral "secret code" lists

Finding: codes such as /ELI5, /TLDR, /STEP-BY-STEP and /HUMANIZE are not product features. Status: MYTH as features, real only as text the model interprets.

Evidence:

1. OpenAI's help centre documents only two things that typing a slash does in ChatGPT: opening a tool menu (to pick Search) and starting deep research. None of the viral codes appears anywhere in the help centre pages read.
2. Technology press agrees. Tom's Guide (Amanda Caswell, AI Editor, 2 October 2026) recommends made-up slash words as a prompting habit and says of them: "The slash itself isn't magic." The article explains that the reliable way to make such a word behave consistently is to define it yourself in ChatGPT's custom instructions. URL: https://www.tomsguide.com/ai/chatgpt/9-slash-commands-to-get-better-answers-from-chatgpt-number-7-is-my-personal-favorite
3. No OpenAI staff statement on "cheat codes" was found. The search allowance ran out before this could be looked for properly, so this is a gap, not a negative finding.

What is safe to say in print: a made-up word like /short works only because the model reads it as an instruction, results vary, and a reader who wants a personal shortcut word should define it in custom instructions (a documented feature). That last point is SECONDARY: the feature is documented, the technique is from the press.

## 10. Top 12 shortcuts safe to print (ChatGPT unless stated)

Ranked by usefulness to a pub landlord. All VERIFIED in vendor documentation on 13 October 2026.

| # | Shortcut | Plan | Source | Pub example |
|---|---|---|---|---|
| 1 | Custom instructions: tell it once who you are and how to write. Settings, Personalization (web) or Customize ChatGPT (phone). | All plans. Free and Go: 1,500 characters. | https://help.openai.com/en/articles/8096356-chatgpt-custom-instructions | Say you run a village pub with a kitchen, want plain British English and short answers. |
| 2 | Photo and file upload: the + icon, Add photos & files. | Free and paid. Free: three file uploads a day. | https://help.openai.com/en/articles/8400551-chatgpt-image-inputs-faq | Photograph a handwritten rota or delivery note and ask for a tidy table. |
| 3 | Switch off training: Settings, Data controls, Improve the model for everyone. | Personal plans. | https://help.openai.com/en/articles/7730893-data-controls-in-chatgpt | Do this before pasting takings, supplier terms or anything about staff. |
| 4 | Temporary chat: new chat, select Temporary. | Not stated. | https://help.openai.com/en/articles/8914046-temporary-chat-in-chatgpt | A one-off draft reply to a difficult complaint that you do not want kept in history. |
| 5 | Triple quotes or ### around pasted text. | Any plan, any assistant. | https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api | Put a customer review between triple quotes and ask for a polite reply. |
| 6 | Voice and dictation: the Voice icon, or the microphone. | All plans. Free is limited. | https://help.openai.com/en/articles/20001274-chatgpt-voice | Talk through next week's specials while your hands are busy in the cellar. |
| 7 | Projects: New project in the sidebar. | Free (5 files per project) and paid. | https://help.openai.com/en/articles/10169521-projects-in-chatgpt | One project for Christmas bookings, holding the menu, your notes and your tone. |
| 8 | Find and pin: Ctrl+K or Cmd+K on web to search. Pin chat from the three dots (web) or long-press (phone). | Search on all plans. | https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt | Find last year's quiz night poster wording, and pin your weekly specials chat. |
| 9 | The slash menu: type / and pick Search, or type /Deepresearch. Signed in. | Search on all plans. Deep research allowance varies. | https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt; https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt | Check what is on locally this weekend before setting staffing. |
| 10 | Scheduled tasks: ask for something on a schedule, manage it under Scheduled. | Free: three active tasks. More on paid. | https://help.openai.com/en/articles/10291617-scheduled-tasks-in-chatgpt | Every Monday morning, draft the week's social posts from your events list. |
| 11 | Share link: Share, then copy the link. Anyone with the link can read it. | Personal accounts. | https://help.openai.com/en/articles/7925741-sharing-conversations-and-scheduled-tasks-in-chatgpt | Send a draft events calendar to your assistant manager. Never share a chat with private details. |
| 12 | WhatsApp, Meta AI: type /reset-ai to delete Meta AI's copy of a chat. | Free. Meta AI is in limited countries. | https://faq.whatsapp.com/688464770796037 | After asking Meta AI to tidy a rota message in the staff group, clear what it holds. |

Reserves, also VERIFIED: the Copilot key or Windows key + C to open Copilot on a Windows PC (https://support.microsoft.com/en-gb/microsoft-365-copilot/access-microsoft-365-copilot-on-windows); image creation in ChatGPT on all tiers; Claude incognito chat on all plans; Gemini's Keep activity switch.

Print caveat for number 9: the slash menu is in OpenAI's documentation but did not appear in a logged-out browser test, and no help page lists the whole menu. The copy should say "when signed in".

## 11. Do not print as current fact

- Any "secret code" list (/ELI5, /TLDR, /HUMANIZE and so on) described as hidden features.
- `#` as a ChatGPT, Copilot, Gemini, Claude or Perplexity feature.
- ChatGPT: `/agent` and agent mode, canvas and `/canvas`, custom GPTs and `@` for GPTs, the GPT Store as something to build in, Pulse, Atlas, group chats.
- ChatGPT keyboard shortcuts other than Ctrl+K or Cmd+K for search. The rest are not in current documentation.
- ChatGPT connections to Gmail, Outlook or calendars as a promise for UK personal plans. The documentation says availability depends on plan and region.
- ChatGPT skills for personal plans (business plans only).
- Copilot: Deep Research, Podcasts, Group Chat, the Mico character in voice, `@` for agents, Alt+Space, and the training switches (older app only).
- Gemini: Gems, `/` for skills (changing to `@`), asking Gemini to remember facts (US only), Gemini Live in a browser, temporary chat as a certainty for UK users.
- Claude: `@` mentions, a list of keyboard shortcuts for the web app, image generation, styles.
- Perplexity: `/` shortcuts outside the Comet browser, Pages, Spaces (now Projects).
- Meta AI in WhatsApp: `/imagine`, a way to switch Meta AI off, and UK availability as a given.

## 12. Uncertain or contradictory

1. OpenAI's capabilities overview (about 8 Oct 2026) still lists canvas and custom GPTs, although the release notes say canvas left the current models in May 2026 and GPTs retire in December 2026. The canvas link on that page leads to an article that no longer exists. Source: https://help.openai.com/en/articles/9260256-chatgpt-capabilities-overview
2. The ChatGPT agent article still tells readers to type `/agent`, under a banner saying the agent is no longer available.
3. ChatGPT desktop shortcuts are documented on pages that predate, or do not mention, the new desktop app. The Windows page still talks about an early version.
4. The only source for the ChatGPT shortcut list key (`Cmd+/` or `Ctrl+/`) is a 2023 release note. It did nothing in a logged-out browser. It may still work when signed in, which was not tested, because no account was used.
5. Gemini: the UK English help page lacks the temporary chat section that the US English page has. Google's UK English Privacy Hub does refer to temporary chats.
6. Microsoft: two generations of the Copilot app exist side by side in the documentation. Some feature pages (connectors, conversation modes) still describe the older site. Voice is described both as part of every Copilot experience and as needing an eligible subscription.
7. Perplexity: one page documents `/` shortcuts in Comet, another says Shortcuts have moved to Skills. Most Perplexity pages show a last modified date in September 2026.
8. Claude: the interface is mid-rollout (chat and Cowork merging), so what a reader sees depends on their account.
9. WhatsApp help pages show no dates, so their freshness cannot be judged.
10. Not checked: prices, the mobile behaviour of `/` and `@` in ChatGPT, UK regulator guidance, and anything that needs a signed-in account.

## 13. Housekeeping

- Page copies used for the phrase-matching are in the session scratchpad under `pages/`, with the small scripts used under `tools/`. Some early temporary files are in `/tmp/claude-probe`. None is in the repository.
- No account was signed in to, and nothing was sent or submitted. On chatgpt.com the cookie banner was answered with the reject non-essential option.
