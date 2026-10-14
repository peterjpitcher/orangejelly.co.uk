# AI in pubs and small hospitality: UK rules and risks dossier

> **Background evidence, gathered on 13 October 2026.** This file is for Peter. It is not approved for use in copy: only the fact banks in the two specs are, and some claims here were left out of them on purpose. See `../README.md`, section 2.3. File paths that mention a scratchpad point at working files that were not kept.


Research date: 13 October 2026. All URLs were opened on that date unless stated.
Audience: members of the British Institute of Innkeeping (small pubs, restaurants, cafes).
Purpose: source material for a short "house rules" box in print and a fuller online section.

## How to read this dossier

Each point gives the claim, its type, a status, the source and an exact quote of under 25 words.

Type labels:

- **Law (must)**: an Act, regulations or assimilated EU law.
- **Regulator guidance (should)**: what a regulator expects. Not law in itself, but it shows how the law will be applied.
- **Advertising code**: the CAP Code, enforced by the Advertising Standards Authority (ASA). Self-regulation, not statute.
- **Provider terms**: what the AI supplier itself says about its product.
- **Good practice (sensible)**: advice from an authoritative body with no legal force.
- **Ruling or case**: a decision by a court, tribunal or the ASA.

Status labels:

- **VERIFIED**: read at the primary source on 13 October 2026, quote copied from the page.
- **SECONDARY**: only confirmed through a law firm, trade press or a search summary.
- **UNVERIFIED**: could not be confirmed. Do not print as fact.

Curly quotation marks in sources have been set as straight ones. Nothing else in a quote has been changed.

## Three things that changed in 2026 and affect how this is written up

1. **The regulator changed its legal form.** The Information Commissioner's Office became the Information Commission on 30 September 2026. It still uses the letters ICO and the address ico.org.uk. Guidance published before that date still carries the old name.
   - Status: VERIFIED. Source: GOV.UK, "Data Use and Access Act 2025: plans for commencement", last updated 12 October 2026. https://www.gov.uk/guidance/data-use-and-access-act-2025-plans-for-commencement
   - Quote: "abolishing the office of the Information Commissioner, transferring its functions to the new Information Commission from 30 September 2026"
   - The ICO home page title now reads "Information Commission's Office" (VERIFIED, https://ico.org.uk/).
2. **There is a new Prime Minister.** Andy Burnham took office on 20 July 2026. The copyright and AI report, the King's Speech and most AI policy papers cited here were published under the previous administration, so policy positions may move.
   - Status: VERIFIED. Source: GOV.UK, Prime Minister role page. https://www.gov.uk/government/ministers/prime-minister
   - Quote: "Andy Burnham became Prime Minister on 20 July 2026."
3. **Department names are shifting.** Recent GOV.UK pages are published by the "Department for Business, Innovation, Science and Trade" alongside the Department for Science, Innovation and Technology (DSIT). Cite each document by the publisher shown on its page. (VERIFIED on the commencement page above.)

## Method and limits

- Primary sources were read directly: legislation.gov.uk, ico.org.uk, gov.uk (CMA, FSA, DSIT, IPO), asa.org.uk, foodstandards.gov.scot, ncsc.gov.uk, acas.org.uk, judiciary.uk, the UK Parliament bills and committees data services, and the European Commission.
- The shared web search allowance for this session ran out part way through. After that, sources were found by going straight to official sites, their sitemaps and their own search tools. Some questions could not be searched as widely as planned. These are listed in section 11.
- OpenAI's pages refused automated access and were read in a normal browser window instead. The Equality and Human Rights Commission, the British Business Bank and the Parliament committee document store blocked automated access, so some items there are unverified.
- This dossier is research, not legal advice.

---

## 1. Data protection

### 1.1 There is no AI exemption. Data protection law applies in full.

- Type: Regulator guidance (should), restating the law.
- Status: VERIFIED.
- Source: ICO, "Response to the consultation series on generative AI: Tackling misconceptions". Page undated; the response was issued in December 2024 (date SECONDARY). https://ico.org.uk/about-the-ico/what-we-do/our-work-on-artificial-intelligence/response-to-the-consultation-series-on-generative-ai/tackling-misconceptions/
- Quote: "There is no 'AI exemption' to data protection law."

### 1.2 You must check what the tool produces if it concerns people.

- Claim: The accuracy principle applies to AI output about individuals. The business using the tool has to check it and correct errors.
- Type: Regulator guidance, using the word "must" because it reflects the UK GDPR accuracy principle.
- Status: VERIFIED.
- Source: ICO Innovation Advice service, "Previously asked questions", Generative AI section, last updated 16 December 2025. https://ico.org.uk/for-organisations/advice-and-services/innovation-advice/previously-asked-questions/
- Quote: "When using an AI tool, organisations must check that the outputs are accurate, and take steps to correct any inaccurate information."
- Note: this page carries a banner saying it is under review because of the Data (Use and Access) Act.

### 1.3 Processor or separate controller: it depends on what the supplier does with the data.

- Claim: If the supplier only acts on your instructions it is a processor. If it uses what you enter for its own purposes, such as training its model, it is a controller in its own right for that use.
- Type: Regulator guidance (should).
- Status: VERIFIED.
- Source: ICO, "Previously asked questions", Controllers and processors section, last updated 16 December 2025 (URL as 1.2).
- Quotes: "the AI service is acting under instruction, the AI service provider is likely to be a processor" and "the AI service provider would be a separate controller"
- The second quote completes this sentence in the source: where the provider wants to use the information shared to train its model and the organisation is not involved in that.
- Supporting position (consultation response, not final guidance): a contract label does not settle the role, and with closed commercial models joint controllership may be more likely.
  - Source: ICO, "Allocating controllership across the generative AI supply chain". https://ico.org.uk/about-the-ico/what-we-do/our-work-on-artificial-intelligence/response-to-the-consultation-series-on-generative-ai/allocating-controllership-across-the-generative-ai-supply-chain/
  - Quote: "a contract does not necessarily determine whether an organisation is a controller, joint controller or processor"

### 1.4 If a supplier is your processor, a written contract is compulsory.

- Type: Law (must).
- Status: VERIFIED.
- Source: UK GDPR, Article 28(3). https://www.legislation.gov.uk/eur/2016/679/article/28
- Quote: "Processing by a processor shall be governed by a contract or other legal act"
- Source: ICO, "Guide to accountability and governance: Contracts", latest update 19 May 2023. https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/accountability-and-governance/guide-to-accountability-and-governance/contracts/
- Quote: "Whenever a controller uses a processor, there must be a written contract (or other legal act) in place."

### 1.5 You still need a lawful basis, and a second condition for health and other special category data.

- Claim: Using an AI tool for a job you already do lawfully does not need a new lawful basis. A new purpose does. Special category data always needs an Article 9 condition as well.
- Type: Regulator guidance restating law.
- Status: VERIFIED.
- Source: ICO, "Previously asked questions", Generative AI section (URL as 1.2).
- Quote: "If processing contains special category data, the organisation must ensure it has a second condition for processing in place, as required by Article 9"
- Where personal data is shared with the supplier for the supplier's own use, the same page says the business must identify a legal basis, and a special category condition where needed, for that sharing.

### 1.6 Allergy and dietary details about a named person are special category (health) data.

- Type: Regulator guidance restating law. The step from "health data" to "allergy" is an inference, see below.
- Status: VERIFIED for the definition and for dietary requirements. The ICO has no page that names allergies specifically (searched, none found).
- Source: ICO, "What is special category data?", latest update 9 April 2024. https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/
- Quote: "includes any related data which reveals anything about the state of someone's health"
- Source: ICO's own privacy notice for event attendees (undated). https://ico.org.uk/global/privacy-notice/attend-an-event-seminar-or-workshop/
- Quote: "this type of information is classed as special category data"
- Context: the ICO sentence is about dietary or access requirements it collects from delegates.
- Inference for the article: a booking note such as "Table 6, Mrs Jones, severe nut allergy" is health data about an identifiable person. An allergen matrix for the menu is not personal data at all.

### 1.7 Tell people. Privacy notices should say that AI tools are used.

- Type: Regulator guidance (should).
- Status: VERIFIED.
- Source: ICO, "Previously asked questions" (URL as 1.2).
- Quote: "Where an AI tool is used, privacy notices should be updated to inform people about how it is being used, and for what purposes."

### 1.8 Most of these tools are hosted outside the UK, so transfer rules apply.

- Type: Regulator guidance restating law.
- Status: VERIFIED.
- Source: ICO, "Previously asked questions" (URL as 1.2).
- Quote: "they must follow rules around international transfers where they are sharing personal data with anyone based outside of the UK"

### 1.9 Consumer and business tiers differ on training. This is the single most useful practical distinction.

All four statements below are **Provider terms**, VERIFIED on the supplier's own page. Terms change often, so the article should tell readers to check the current wording.

| Product | What the supplier says | Source and date |
|---|---|---|
| ChatGPT Free, Plus, Pro (personal) | Content may be used for training unless the user opts out. Quote: "When you use our services for individuals (Free, Plus, Pro), we may use your content to train our models." | OpenAI Help Center, "How your data is used to improve model performance", shown as updated the day before access (about 12 October 2026). https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance |
| ChatGPT Business, Enterprise, Edu, API | Not used for training by default. Quote: "By default, we do not use your business data for training our models." | OpenAI, "Enterprise privacy at OpenAI", updated 8 January 2026. https://openai.com/enterprise-privacy/ |
| OpenAI data processing agreement | Offered for business products only. Quote: "we are able to execute a Data Processing Addendum (DPA) with customers for their use of ChatGPT Business, ChatGPT Enterprise, and the API" | As above. |
| Microsoft Copilot (personal) | Used for training unless opted out. The UK is not on the list of excluded countries. Quote: "Microsoft uses data from Bing, MSN, Copilot, and interactions with ads on Microsoft for AI training" | Microsoft Support, "Privacy FAQ for Microsoft Copilot" (undated). The page says it describes the older app, and that a new app from 18 August 2026 has its own privacy article, which was not read. https://support.microsoft.com/en-us/topic/privacy-faq-for-microsoft-copilot-27b3a435-8dc9-4b55-9a4b-58eeb9647a7f |
| Microsoft Copilot (personal), advice | Quote: "You shouldn't provide any confidential or sensitive personal data that you would not want Microsoft to use" | As above. |
| Microsoft 365 Copilot (work account) | Quote: "Prompts, responses, and data accessed through Microsoft Graph aren't used to train foundation LLMs" | Microsoft Learn, "Data, Privacy, and Security for Microsoft Copilot" (undated). https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy |
| Google Gemini app (personal) | Human reviewers may read chats. Quote: "Please don't enter confidential information that you wouldn't want a reviewer to see or Google to use to improve our services" | Google, "Gemini Apps Privacy Hub" (undated). https://support.google.com/gemini/answer/13594961?hl=en-GB |
| Gemini in Google Workspace (business) | Quote: "Your content is not human reviewed or otherwise used for Generative AI model training outside your domain without permission." | Google, "Generative AI in Google Workspace Privacy Hub" (undated). https://support.google.com/a/answer/15706919?hl=en |

**Synthesis for the article (inference, not a quote from any regulator).** On a personal tier the supplier typically keeps the right to use what you type for its own purposes and offers no data processing agreement. Put 1.3, 1.4 and 1.5 together and a pub that pastes customer or staff personal data into a personal account has (a) no processor contract, (b) made a disclosure to a separate controller that needs its own lawful basis and should be in the privacy notice, and (c) needs an Article 9 condition if allergy or health details are included. The ICO has not, so far as this research found, published a sentence saying "do not paste personal data into ChatGPT". The safe wording is: use a business tier with a data processing agreement and training switched off, or remove names and identifying details first.

### 1.10 CCTV: ordinary CCTV rules apply, and face recognition or other AI analysis raises the bar sharply.

- Claim: Any face recognition on CCTV is treated as high risk and will usually involve biometric special category data.
- Type: Regulator guidance (should), with a legal duty to do a data protection impact assessment (DPIA) for high risk processing behind it.
- Status: VERIFIED.
- Source: ICO, "Facial Recognition Technology (FRT) and surveillance" (undated, marked under review). https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/cctv-and-video-surveillance/guidance-on-video-surveillance-including-cctv/additional-considerations-for-technologies-other-than-cctv/facial-recognition-technology-frt-and-surveillance/
- Quote: "any processing you undertake as a result of deploying FRT is likely to result in a high risk to individuals' information rights"
- Basic CCTV duty, same guidance set, "Checklist for limited CCTV systems": https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/cctv-and-video-surveillance/guidance-on-video-surveillance-including-cctv/checklist-for-limited-cctv-systems/
- Quote: "There are visible signs showing that CCTV is in operation."
- Practical inference: uploading CCTV stills or clips of customers or staff to a consumer chatbot "to see who this is" or "to summarise the incident" is a disclosure of personal data, and of biometric data if the tool tries to identify people.

### 1.11 Staff biometrics: the ICO has already acted in the leisure sector.

- Type: Ruling or case (ICO enforcement notices).
- Status: VERIFIED.
- Source: ICO news, "ICO orders Serco Leisure to stop using facial recognition technology to monitor attendance of leisure centre employees", 23 February 2024. https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/02/ico-orders-serco-leisure-to-stop-using-facial-recognition-technology/
- Quote: "They failed to show why it is necessary or proportionate to use FRT and fingerprint scanning for this purpose"
- Relevance: face or fingerprint clocking in for bar and kitchen staff needs a real justification and a genuine alternative.

### 1.12 Data (Use and Access) Act 2025: what is in force for AI and automated decisions

| Provision | What it does | In force | Status and source |
|---|---|---|---|
| Section 80 and Schedule 6 | Replaces Article 22 UK GDPR with Articles 22A to 22D. Solely automated significant decisions are now permitted more widely, provided the safeguards are in place. They stay restricted where special category data is used, and they cannot rest on the new "recognised legitimate interests" basis (Article 22B(4)). | 5 February 2026 | VERIFIED. SI 2026/82, regulation 2(j), made 29 January 2026. https://www.legislation.gov.uk/uksi/2026/82/made Quote: "(j) section 80 (automated decision-making)" in the list of provisions that "come into force on 5th February 2026". |
| Sections 135 to 137 | Required the government to publish an economic impact assessment, a report and a progress statement on copyright and AI. They change no rules for businesses. | 20 August 2025 | VERIFIED for section 136. https://www.legislation.gov.uk/ukpga/2025/18/section/136 Commencement note: "S. 136 in force at 20.8.2025 by S.I. 2025/904, reg. 2(w)". |
| Complaints duty | Every controller must help people complain about data use, acknowledge within 30 days and respond without undue delay. Not about AI, but it applies to every pub that holds customer or staff data. | By 19 June 2026 | VERIFIED. ICO, "The Data Use and Access Act 2025 (DUAA) - what does it mean for organisations?", updated 19 June 2026. https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-what-does-it-mean-for-organisations/ Quote: "all data protection provisions in the Data (Use and Access) Act 2025 are now in force" |
| Regulator reform | Information Commission replaces the Information Commissioner. | 30 September 2026 | VERIFIED, see the opening section. |

The safeguards themselves (Law, VERIFIED, https://www.legislation.gov.uk/ukpga/2025/18/section/80):

- Definition, Article 22A(1)(a). Quote: "a decision is based solely on automated processing if there is no meaningful human involvement in the taking of the decision"
- Safeguards, Article 22C(2): tell the person, let them make representations, let them get a human to look at it, let them contest it. Quote: "enable the data subject to obtain human intervention on the part of the controller in relation to such decisions"
- Special category data, Article 22B(1). Quote: "may not be taken based solely on automated processing, unless one of the following conditions is met"

ICO summary of the change (VERIFIED, DUAA page above). Quote: "This doesn't apply to special category data which is more protected."

ICO guidance on the new rules is not final. The draft was consulted on from 31 March to 29 May 2026 and the plans page says: "Final version of guidance due for publication: Winter 2026" (VERIFIED, https://ico.org.uk/about-the-ico/what-we-do/our-plans-for-new-and-updated-guidance/technology/).

---

## 2. Reviews and advertising

### 2.1 Fake reviews are a banned practice across the UK from 6 April 2025.

- Type: Law (must).
- Status: VERIFIED.
- Source: Digital Markets, Competition and Consumers Act 2024 (DMCC Act), Schedule 20, paragraph 13. https://www.legislation.gov.uk/ukpga/2024/13/schedule/20
- Commencement: SI 2025/272, regulation 2, made 4 March 2025. https://www.legislation.gov.uk/uksi/2025/272/made Quote: "come into force on 6th April 2025"
- Definition quote, paragraph 13(5)(b): "a consumer review that purports to be, but is not, based on a person's genuine experience"

### 2.2 What is caught, in terms a pub will recognise

All VERIFIED. Law from Schedule 20 paragraph 13. Guidance from CMA, "Fake reviews: CMA208", published 4 April 2025. https://www.gov.uk/government/publications/fake-reviews-cma208 (PDF: https://assets.publishing.service.gov.uk/media/67eeb64fe9c76fa33048c790/CMA208_-_Fake_reviews_guidance.pdf)

- **AI written reviews are covered.** Law, paragraph 13(5)(f). Quote: "'writing' includes creating by any means". CMA208 example. Quote: "have in fact been generated by software applications (such as bots)"
- **Asking staff to post reviews counts as commissioning.** CMA208 paragraph 2.10. Quote: "It could include a trader requesting a member of staff to write a review of the trader's product."
- **Hidden incentives are banned.** Law, paragraph 13(1)(b): a review "that conceals the fact it has been incentivised".
- **Cherry picking on your own website is banned.** Law, paragraph 13(5)(i). Quote: "failing to publish, or removing from publication, negative consumer reviews whilst publishing positive ones"
- **Genuine reviews are fine.** CMA208 paragraph 3.6. Quote: "Reviews that reflect a person's genuine experience of a product or service are allowed."
- **If you show reviews on your own site you are a publisher** and must take reasonable and proportionate steps to keep fake ones off it. CMA208 calls a business that displays ratings from another site a "second-party publisher".

### 2.3 Penalties and enforcement

- Claim: The CMA can decide breaches itself and fine up to 10% of global turnover. The fake review practice is not itself a criminal offence under section 237.
- Type: Law.
- Status: VERIFIED.
- Source: CMA press release, 27 March 2026. https://www.gov.uk/government/news/fake-and-misleading-reviews-5-businesses-under-cma-investigation Quote: "it can require businesses to change their practices and impose fines of up to 10% of global turnover"
- Source: DMCC Act section 237(8)(b), which lists among the practices excluded from the offence: "the descriptions of practices mentioned in paragraph 13 of that Schedule". https://www.legislation.gov.uk/ukpga/2024/13/section/237
- Caution: do not write "fake reviews are never criminal". Other misleading conduct can still be an offence under section 237(1).
- Who else can enforce: section 151 names "every local weights and measures authority in Great Britain" (Trading Standards) and "the Department for the Economy in Northern Ireland" alongside the CMA. VERIFIED. https://www.legislation.gov.uk/ukpga/2024/13/section/151 The power to fine directly, without going to court, is described in the CMA's own releases as the CMA's.
- Live food sector cases (VERIFIED, same press release): the CMA opened investigations on 26 March 2026 into Just Eat (star ratings) and Pasta Evangelists. Quote on the latter: "customers were offered discounts on future orders in exchange for leaving 5-star reviews on delivery apps". The case page was last updated 28 September 2026 and says the investigation is ongoing, with no finding made. https://www.gov.uk/cma-cases/pasta-evangelists-consumer-protection-enforcement-case
- The CMA's first fine under its new powers was procedural, not about reviews: Euro Car Parks, £473,000, 13 February 2026 (VERIFIED, https://www.gov.uk/government/news/cma-fines-euro-car-parks-473k-for-failure-to-comply-with-legal-information-notice).
- The CMA says it sent advisory letters to 54 firms after reviewing more than 100 review publishers (VERIFIED, 27 March 2026 release).
- A three month period of lighter touch enforcement after April 2025: SECONDARY only.

### 2.4 Using AI to draft a reply to a genuine review

- Claim: Not caught by the fake review ban, because the owner's reply is not a "consumer review" pretending to be a customer's experience. Other rules still apply.
- Type: Inference from the law. No regulator statement was found.
- Status: The definitions are VERIFIED (2.1). CMA208 was searched for any passage on trader replies and has none. The conclusion is the researcher's reading and should be worded as such.
- What still applies: the reply must not mislead (general unfair trading rules in the DMCC Act), must be checked for accuracy (1.2), and must not reveal the reviewer's personal details. Pasting a review that contains a name and booking details into a personal AI account raises the data protection points in 1.9.
- Safe wording for print: "AI can help you draft a reply to a real review. It must never write the review."

### 2.5 ASA and CAP position on AI in adverts

All VERIFIED at asa.org.uk.

- **No AI specific rules, existing rules apply.** Type: Advertising code (CAP advice on how the Code applies, which is the type for every point in this list). Source: CAP News, "Disclosure of AI in Advertising: Striking the Balance Between Creativity and Responsibility", 29 May 2025. https://www.asa.org.uk/news/disclosure-of-ai-in-advertising-striking-the-balance-between-creativity-and-responsibility.html Quote: "our existing rules apply regardless of how content is generated, edited, or targeted"
- **No general duty to label AI content.** Same source. Quote: "There is no blanket legal requirement in the UK to disclose the use of AI in ads"
- **A label does not rescue a misleading ad.** Same source. Quote: "disclosure alone is very unlikely to mitigate the harm caused by a fundamentally misleading message"
- **The advertiser carries the can for AI output.** Source: CAP News, "AI and Deepfakes: Four Things Advertisers Need to Know Before They Hit 'Run'", 11 June 2026. https://www.asa.org.uk/news/ai-and-deepfakes-four-things-advertisers-need-to-know-before-they-hit-run.html Quote: "the advertiser remains responsible for any output used in their ads"
- **AI images that overstate the product can mislead.** Source: CAP News, "Generative AI & Advertising: Decoding AI Regulation", 31 August 2023. https://www.asa.org.uk/news/generative-ai-advertising-decoding-ai-regulation.html Quote: "there is the potential for them to mislead if they do not accurately reflect the efficacy of the product"
- Government position on labelling (VERIFIED, copyright report, section 3). Quote: "There are no obligations in the UK for AI-generated content to be labelled"

Inference for hospitality: an AI picture of a dish, a beer garden or a function room that the customer will not actually get is a misleading image in the same way as a doctored photograph. The ASA has not ruled on that exact scenario (see 2.6).

### 2.6 ASA rulings

The ASA rulings database was searched on 13 October 2026 for AI related terms. **No ruling was found about AI generated images in an advert for a pub, restaurant, hotel or food outlet.** The relevant rulings are:

| Ruling | Date | Outcome | Why it matters | Quote |
|---|---|---|---|---|
| Birling Shore Ltd t/a ShroomIQ (children's food supplement) | 22 April 2026 | Upheld (three of four issues) | The closest food sector case. "Experts" on the site were AI generated and a footer said so. The disclaimer did not save the ad. | Advertiser's disclaimer: "Some images, including product visuals, names and people shown, are AI-generated representations" |
| CC Response NW Ltd t/a Motor Claims Line | 29 April 2026 | Upheld | A headline claim written by AI was false. The advertiser was still responsible. | "the claim '100% Free Service' in ad (b) had been generated by AI and they had since removed it" |
| BCCR Ltd t/a Belief Coding Cognitive Rewiring | 1 October 2025 | Upheld | An agency used AI to summarise a paper and the tool invented a statistic. | "the figure had incorrectly been attributed to the paper by the AI tool" |
| Person(s) Unknown t/a Henry's Boots | 9 April 2025 | Upheld | A fictional AI generated founder used to sell "handmade" boots. | "The ASA, who understood the images of the man were AI-generated and 'Henry' was not a real person" |
| UAB CommerceCore t/a WiggyDog | 25 March 2026 | Upheld | Footage that appeared to show real or AI generated puppies overstated how lifelike a toy was. | Not quoted. |
| Kentucky Fried Chicken (Great Britain) Ltd | 8 July 2026 | Not upheld | Appears in AI searches only because TikTok added its own AI summary under the ad. The case was about the new less healthy food rules. Not an AI imagery ruling, so do not cite it as one. | Not quoted. |

URLs:
- https://www.asa.org.uk/rulings/birling-shore-ltd-g25-1323444-birling-shore-ltd.html
- https://www.asa.org.uk/rulings/cc-response-nw-ltd-a25-1299398-cc-response-nw-ltd-.html
- https://www.asa.org.uk/rulings/bccr-ltd-a25-1297374-bccr-ltd.html
- https://www.asa.org.uk/rulings/person-s--unknown-a24-1267935-person-s--unknown.html
- https://www.asa.org.uk/rulings/uab-commercecore-g25-1321974-uab-commercecore.html
- https://www.asa.org.uk/rulings/kentucky-fried-chicken--great-britain--ltd-g26-1325189-kentucky-fried-chicken--great-britain--ltd.html

Two of these rulings cover a business's own website and own social media posts, which confirms that the ASA reaches a pub's own channels, not only paid adverts. The CC Response ruling also records that the ad was picked up by the ASA's own AI monitoring system, so the regulator is itself using AI to find problem ads.

---

## 3. Copyright and ownership

### 3.1 The statute

- Claim: UK law has an unusual rule giving copyright in a work "generated by computer" with no human author to the person who made the arrangements. It lasts 50 years.
- Type: Law.
- Status: VERIFIED.
- Source: Copyright, Designs and Patents Act 1988, sections 9(3), 12(7) and 178. https://www.legislation.gov.uk/ukpga/1988/48/section/9
- Quote, s.9(3): "the author shall be taken to be the person by whom the arrangements necessary for the creation of the work are undertaken"
- Quote, s.178: "there is no human author of the work"
- Quote, s.12(7): "copyright expires at the end of the period of 50 years from the end of the calendar year in which the work was made"

### 3.2 How far that rule protects AI output is uncertain, and the government proposes to remove it.

- Type: Government policy paper. Not law.
- Status: VERIFIED.
- Source: DSIT, DCMS and the Intellectual Property Office, "Report on Copyright and Artificial Intelligence", published 18 March 2026 under section 136 of the Data (Use and Access) Act 2025. https://www.gov.uk/government/publications/report-and-impact-assessment-on-copyright-and-artificial-intelligence/report-on-copyright-and-artificial-intelligence
- Quote on uncertainty: "it is unclear in the absence of case law how an 'original' yet wholly machine-authored work would be defined"
- Quote on the proposal: "we propose that this specific type of protection should be removed, while copyright should continue to protect works created with AI assistance"
- Meaning for a pub: a logo, menu illustration or poster produced entirely by a prompt may have weak or no copyright protection, now or after reform. Work where a person has made real creative choices is on firmer ground.

### 3.3 Training on copyright works: no change to the law.

- Status: VERIFIED (same report).
- Quote: "a broad copyright exception with opt-out is no longer the government's preferred way forward"
- The consultation ran from 17 December 2024 to 25 February 2025. Its GOV.UK page was last updated 19 March 2026 and still reads "We are analysing your feedback" (VERIFIED, https://www.gov.uk/government/consultations/copyright-and-artificial-intelligence).
- No copyright or AI bill appears in the King's Speech of 13 May 2026 (VERIFIED, section 6).
- Reported statements that the government has "no current plans to amend copyright legislation" (response to a Lords committee, 15 May 2026): SECONDARY only.
- The Commons Culture, Media and Sport Committee (listed in the Parliament data service under its older name, the Digital, Culture, Media and Sport Committee) published a letter from its Chair to the Minister for Creative Industries, Media and Online Safety "regarding AI and copyright", dated 13 October 2026, the day of this research. Title and date VERIFIED, content not read. The issue is live.

### 3.4 What the supplier's terms say

- Type: Provider terms. Status: VERIFIED.
- Source: OpenAI, "Enterprise privacy at OpenAI", updated 8 January 2026 (URL in 1.9).
- Quote: "You own your inputs and outputs (where allowed by law)"
- Caution: that is a promise between you and the supplier. It does not create copyright where the law gives none, and it does not protect you if the output copies someone else's work or brand.

### 3.5 Risk of copying someone else

- Getty Images v Stability AI [2025] EWHC 2863 (Ch), High Court, 4 November 2025. The citation and date are VERIFIED at https://www.judiciary.uk/judgments/getty-images-v-stability-ai/. The judgment itself was not read in this session, so do not describe its findings without checking.
- Good practice (sensible, researcher's wording): do not prompt for "in the style of" a named living artist or a competitor's branding, and check output for stray logos or watermarks before using it.

---

## 4. Food law

### 4.1 The food business is legally responsible for the accuracy of allergen information.

- Type: Law (must).
- Status: VERIFIED.
- Source: assimilated Regulation (EU) No 1169/2011, Article 8(2). https://www.legislation.gov.uk/eur/2011/1169/article/8
- Quote: "shall ensure the presence and accuracy of the food information"

### 4.2 "However it is provided": the regulator's wording that covers AI without naming it.

- Type: Regulator guidance restating law.
- Status: VERIFIED.
- Source: Food Standards Agency (FSA), "Food allergen labelling and information requirements: technical guidance", published 23 August 2023, revised March 2025. Applies to England, Wales and Northern Ireland. https://www.gov.uk/government/publications/food-allergen-labelling-and-information-requirements-technical-guidance/food-allergen-labelling-and-information-requirements-technical-guidance
- Quote: "All information provided about allergens must be accurate, however it is provided."
- Source: FSA, "Allergen information for non-prepacked foods: best practice", published 24 February 2025. https://www.gov.uk/government/publications/allergen-information-for-non-prepacked-foods-best-practice/allergen-information-for-non-prepacked-foods-best-practice
- Quote: "The allergen information provided to consumers must be accurate. This is a legal requirement"
- The same document separates law from best practice. Quote: "You are not required by law to follow best practice guidance."
- Source: FSA, "Allergen guidance for food businesses", updated 17 July 2026. https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses/allergen-guidance-for-food-businesses
- Quote: "Food businesses must make sure that staff receive training on allergens."
- Enforcement, same page. Quote: "In some cases businesses may also face prosecution."

### 4.3 What the FSA and Food Standards Scotland have said about AI and allergens

- Finding: **No FSA or Food Standards Scotland (FSS) guidance for food businesses on using AI for allergen information, menus, labelling or food safety paperwork was found.** Status of that negative: searched FSA and FSS material and the GOV.UK search; not exhaustive.
- The nearest official material is advice to the FSA from its independent Science Council.
  - Type: Independent advice to the regulator. Not FSA policy and not guidance to businesses.
  - Status: VERIFIED.
  - Source: FSA Science Council, "Report of project 'artificial intelligence applications in food safety and authenticity'". Prepared 23 September 2025. The GOV.UK page shows a publication date of 25 June 2026, which appears to reflect the move of FSA content to GOV.UK (first publication in October 2025 is SECONDARY). https://www.gov.uk/government/publications/report-artificial-intelligence-applications/science-council-report-of-project-artificial-intelligence-applications-in-food-safety-and-authenticity
  - Quote on responsibility: "ultimate legal responsibility for compliance cannot shift from the FBO"
  - Quote on human judgement: "must not replace human judgement in safety-critical contexts"
  - Quote on regulation: "this report finds no evidence at present that new food safety regulation is required to address the use of AI"
  - Quote on what it asks the FSA to do: "Guidance to FBOs should be issued by the FSA to explain the underlying principles for the use of AI technologies"
  - FBO means food business operator.
  - Whether the FSA has accepted these recommendations or issued that guidance: UNVERIFIED. None was found.
- Scotland.
  - Type: Regulator commissioned research.
  - Status: VERIFIED.
  - Source: FSS, "Research into the use and perceptions of guidance on food safety and standards", published 26 February 2026, section 3.2. https://www.foodstandards.gov.scot/science-and-evidence/research-into-the-use-and-perceptions-of-guidance-on-food-safety-and-standards/section-4
  - Finding: some food businesses said they use tools such as ChatGPT, mainly for operational jobs such as redesigning menus, not for compliance questions.
  - Quote: "had concerns around whether the information provided by AI tools could be trusted"
  - FSS legal position (VERIFIED, https://www.foodstandards.gov.scot/business-and-industry/safety-and-regulation/food-allergies-2). Quote: "provide allergen information to the consumer for both prepacked and non-prepacked food and drink"

### 4.4 Reported incidents

- **No reported UK incident was found in which AI generated or automated allergen information from a food business was wrong and caused harm or enforcement action.** Status: several searches before the search allowance ran out; not exhaustive. Do not print "there have been no incidents". Print "we found no reported UK case".
- Peer reviewed evidence that chatbots get allergy advice wrong (VERIFIED at PubMed, but it tested an early 2023 version of ChatGPT and is not UK specific): Niszczota and Rybicka, "The credibility of dietary advice formulated by ChatGPT: Robo-diets for people with food allergies", Nutrition, 2023;112:112076. https://pubmed.ncbi.nlm.nih.gov/37269717/ Quote: "ChatGPT, although generally accurate, has the potential to produce harmful diets"
- A New Zealand supermarket recipe bot that suggested dangerous mixtures in 2023 (Pak'nSave): SECONDARY only, not a UK case and not about allergens.

### 4.5 Why AI is a poor fit for allergen work (inference, for the online section)

A general chatbot does not know the pub's recipes, its suppliers' current specifications, last week's substitution or the shared fryer. The FSA says allergen records should be built from specification sheets, labels and recipes and kept up to date (VERIFIED, allergen guidance section 4.1). An AI tool can lay out a matrix a person has already checked. It cannot be the source of the facts.

---

## 5. Employment

### 5.1 Recruitment: discrimination law applies whatever tool does the sifting.

- Type: Law (must). Extent: England, Wales and Scotland.
- Status: VERIFIED.
- Source: Equality Act 2010, section 39(1)(a). https://www.legislation.gov.uk/ukpga/2010/15/section/39
- Quote: "in the arrangements A makes for deciding to whom to offer employment"
- Government guidance (should): DSIT, "Responsible AI in Recruitment", 25 March 2024. https://www.gov.uk/government/publications/responsible-ai-in-recruitment-guide/responsible-ai-in-recruitment Quote: "It is essential to ensure that any system your organisation procures is compliant with the Equality Act 2010"
- What the ICO found when it audited recruitment tools (VERIFIED): ICO news, 6 November 2024. https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/11/ico-intervention-into-ai-recruitment-tools-leads-to-better-data-protection-for-job-seekers/ Quote: "allowing recruiters to filter out candidates with certain protected characteristics"

### 5.2 Automated hiring decisions: tell candidates and give them a route to a person.

- Type: Law (Articles 22A to 22C, see 1.12) plus regulator expectation.
- Status: VERIFIED.
- Source: ICO news, "Automated decisions can streamline the hiring process" (31 March 2026). https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2026/03/automated-decisions-can-streamline-the-hiring-process-with-the-right-safeguards-in-place/
- Quote: "Organisations need to be clear with candidates if ADM is being used and explain how it works."
- ADM means automated decision-making. The ICO also expects regular bias checks and says organisations must tell candidates how to challenge a decision.
- Practical reading for a small pub: asking a chatbot to rank CVs and rejecting on its say so, with nobody reading them, is a solely automated significant decision.

### 5.3 Monitoring staff

- Type: Regulator guidance, using "must" for legal requirements.
- Status: VERIFIED. The guidance is marked under review because of the 2025 Act.
- Source: ICO, "Employment practices and data protection: monitoring workers". https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/data-protection-and-monitoring-workers/
- Quote: "Apart from in very exceptional circumstances where covert monitoring is justified, you must inform workers about any monitoring."
- Quote: "Excessive monitoring set out in a policy does not make it lawful, just because it is documented."
- ICO example of an automated decision with significant effect, from the companion page on automated tools (https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/what-do-we-need-to-do-if-we-use-monitoring-tools-that-use-solely-automated-processes/). Quote: "An organisation pays workers based entirely on automated monitoring of their productivity."
- How the ICO uses its words, same guidance. Quote: "Must refers to legislative requirements."
- **Change pending.** The government consulted on "Make Work Pay: workplace monitoring technologies" from 8 July to 30 September 2026. It covers technology "used to monitor, manage or make decisions relating to workers" and applies to England, Scotland and Wales. The outcome is not yet published. VERIFIED. https://www.gov.uk/government/consultations/make-work-pay-workplace-monitoring-technologies Quote: "This consultation ran from midday on 8 July 2026 to 11:59pm on 30 September 2026"

### 5.4 Rotas

- No authority was found that deals with AI rota tools specifically. General position (inference): scheduling software is lawful. The points above bite if the tool profiles individuals, feeds monitoring data into pay or discipline, or makes significant decisions with no manager involved.

### 5.5 HR paperwork and a staff policy: Acas

- Type: Good practice (sensible). Acas has no dedicated advice page on AI (its sitemap was checked). The tips sit in two news releases, both based on surveys in Great Britain.
- Status: VERIFIED.
- Source: Acas, "One third of employers think AI will increase productivity", 15 May 2025. https://www.acas.org.uk/one-third-of-employers-think-ai-will-increase-productivity
- Quote: "Employers should develop clear policies regarding the use of AI at work and should consult workers and any representatives on its introduction."
- Quote: "AI is not perfect, so outputs should be checked for accuracy, tone and bias"
- Quote: "Workers should be careful entering any information that is business sensitive or personal into public tools."
- Earlier release with the same tips: 28 April 2025, https://www.acas.org.uk/1-in-4-workers-worry-that-ai-will-lead-to-job-losses
- Acas also notes that expecting a role to start using AI could amount to a change of terms and conditions.

### 5.6 Equality and Human Rights Commission

- The only EHRC guidance found is for public bodies, not private employers: "Artificial intelligence in public services", 1 September 2022, England, Scotland and Wales. VERIFIED. https://www.equalityhumanrights.com/guidance/artificial-intelligence-public-services Quote: "This guide is for anyone in a public body in England, Scotland or Wales"
- An EHRC supported case about face recognition checks on an Uber Eats courier (2024) could not be confirmed: UNVERIFIED. Leave it out unless checked.

---

## 6. Regulation status

### 6.1 United Kingdom

- **There is no AI specific Act in force in the UK.** AI use is governed by existing law (data protection, consumer, equality, food, copyright) and existing regulators.
- **No government AI bill is before Parliament.** The King's Speech of 13 May 2026 listed 37 bills and none is an AI bill. VERIFIED. Source: Prime Minister's Office, "King's Speech 2026: background briefing notes", published 13 May 2026, updated 28 May 2026. https://www.gov.uk/government/publications/kings-speech-2026-background-briefing-notes
  - The one AI reference of note is in the Regulating for Growth Bill, which proposes regulatory sandboxes. Quote: "Exploring cross-cutting AI sandboxes, enabling responsible testing and adoption of AI-enabled products and services"
- **One private member's bill.** The Artificial Superintelligence Bill (ten minute rule bill, Alex Sobel MP) had its first reading on 8 September 2026 and is listed for second reading on 13 November 2026. VERIFIED through the UK Parliament bills service. https://bills.parliament.uk/bills/4288 Long title quote: "to prohibit the development, deployment and operation of artificial superintelligence systems". It has nothing to say about how a pub uses ChatGPT. It is a backbench bill, not a government one.
- Lord Holmes's Artificial Intelligence (Regulation) Bill [HL] was a bill of the previous session and does not appear in the current one. VERIFIED, same service.
- **Parliamentary pressure.** The Joint Committee on Human Rights published "Human Rights and the Regulation of AI" (4th Report, HC 160) on 14 September 2026. Title and date VERIFIED. That it calls for a dedicated AI bill is SECONDARY. The Business, Innovation, Science and Trade Committee wrote to the Minister for Artificial Intelligence about the government's approach to AI regulation on 16 September 2026 and received a reply dated 23 September 2026 (existence VERIFIED, content not read).
- **ICO.** A code of practice on AI and automated decision-making is on the ICO's list of current work (VERIFIED, https://ico.org.uk/about-the-ico/what-we-do/our-work-on-artificial-intelligence/). Quote: "Code of Practice on AI and Automated Decision Making". That it will be a statutory code is SECONDARY.

### 6.2 EU AI Act

- Type: EU law. Status: VERIFIED at European Commission sources.
- Timetable. Source: European Commission, "AI Act" policy page, last update 3 August 2026. https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai Quote: "The AI Act entered into force on 1 August 2024 and became applicable on 2 August 2026, with some exceptions". High risk rules were pushed back to 2 December 2027 and 2 August 2028 by an amending "AI Omnibus" regulation that entered into force on 27 July 2026.
- Reach outside the EU. Source: AI Act Article 2(1)(c), as published by the Commission's AI Act Service Desk. https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2 Quote: "where the output produced by the AI system is used in the Union"
- Meaning for a UK pub (inference): a pub using a chatbot for its own UK business is not placing an AI system on the EU market and its output is not used in the EU, so the Act does not bite in practice. A group with sites in Ireland or elsewhere in the EU should take advice.
- Northern Ireland: whether any part of the AI Act applies there through the Windsor Framework is UNVERIFIED. Do not make a statement either way without checking.

---

## 7. Practical safeguards recommended by authoritative bodies

| Body | Recommendation | Type and status | Source and quote |
|---|---|---|---|
| National Cyber Security Centre (NCSC) | Keep sensitive information out of public tools. | Good practice. VERIFIED. Blog dated 14 March 2023, written for security professionals and larger organisations, so it is old in AI terms. | "ChatGPT and LLMs: what's the risk". https://www.ncsc.gov.uk/blog-post/chatgpt-and-large-language-models-whats-the-risk Quote: "not to include sensitive information in queries to public LLMs" |
| NCSC | Read the terms before you rely on a tool. | As above. | Quote: "the terms of use and privacy policy need to be thoroughly understood before asking sensitive questions" |
| NCSC | Know that the tools make things up. | Good practice. VERIFIED. Published 13 February 2024. Audience includes small and medium sized organisations. | "AI and cyber security: what you need to know". https://www.ncsc.gov.uk/guidance/ai-and-cyber-security-what-you-need-to-know Quote: "it can get things wrong and present incorrect statements as facts (a flaw known as 'AI hallucination')" |
| ICO | Check outputs. Update the privacy notice. | Regulator guidance. VERIFIED. | See 1.2 and 1.7. |
| ICO | Do a DPIA where AI tools handle high risk personal data. Hold less data. | Regulator guidance for small organisations. VERIFIED. Page undated. | "Five steps to protect your organisation from AI-powered cyber threats". https://ico.org.uk/for-organisations/advice-for-small-organisations/news-blogs-and-events/blogs/five-steps-to-protect-your-organisation-from-ai-powered-cyber-threats/ Quotes: "you should have a data protection impact assessment (DPIA) and appropriate safeguards in place" and "only collect and retain the personal data you genuinely need" |
| Government Digital Service (with DSIT) | Keep a person in control. Do not put non-public information into public tools. | Good practice written for government staff, not businesses. VERIFIED. Published 10 February 2025. | "Artificial Intelligence Playbook for the UK Government". https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html Quotes: "You have meaningful human control at the right stage" and "Never enter any official information directly into public AI applications or APIs unless it's already publicly available or cleared for publication." |
| DSIT | Small business governance guidance is promised, not yet delivered. | Policy statement. VERIFIED. Updated 6 February 2026. | "AI Management Essentials tool: government response". https://www.gov.uk/government/consultations/ai-management-essentials-tool/outcome/guidance-for-using-the-ai-management-essentials-tool-government-response Quote: "develop future guidance focused solely on the foundational governance measures needed to support responsible AI deployment and to specifically target SMEs" |
| DSIT | A general risk toolkit exists, aimed at project teams. | Good practice. VERIFIED. Published 8 September 2026. | "AI Risk Management Toolkit". https://www.gov.uk/government/publications/ai-risk-management-toolkit Quote: "Use this toolkit as a starting point for implementing good risk management practices." |
| Acas | Write a policy, consult staff, check outputs, keep personal data out of public tools. | Good practice. VERIFIED. | See 5.5. |
| Federation of Small Businesses (FSB) | Never paste AI output straight into anything that goes to a customer. | Good practice from a trade body. VERIFIED. Article dated 3 February 2026. | "AI risks for businesses: 5 practical ways to innovate safely". https://www.fsb.org.uk/resources/article/ai-risks-for-businesses-5-practical-ways-to-innovate-safely-MCHKMECWKHEZBIBFFYTTWYV23ZAY Quote: "Never copy and paste AI content directly into a client email or business plan." |
| FSB | Treat free tools as recording what you type. | As above. | Quote: "If the tool is free, assume your data is being recorded." |
| FSB | Keep a person in decisions about people. | As above. | Quote: "keep a human in the loop for any decision that impacts a person's livelihood or data rights" |
| Judiciary of England and Wales | Treat anything typed into a public chatbot as published. | Guidance for judges, useful as an authoritative plain statement. VERIFIED. 31 October 2025. | "Artificial Intelligence (AI) Guidance for Judicial Office Holders". https://www.judiciary.uk/guidance-and-resources/artificial-intelligence-ai-judicial-guidance-october-2025/ Quote: "Any information that you input into a public AI chatbot should be seen as being published to all the world." |
| British Business Bank | No AI guidance for small firms could be located. | UNVERIFIED. The site blocked automated access and its search did not return usable results. | None. |

Other FSB articles exist ("Start here: AI for small businesses", "10 steps to adopting AI") and were not read.

---

## 8. Reliability and liability

### 8.1 Authoritative descriptions of AI errors

- NCSC, 13 February 2024 (VERIFIED, see section 7). Quote: "it can get things wrong and present incorrect statements as facts (a flaw known as 'AI hallucination')"
- Judiciary of England and Wales, 31 October 2025 (VERIFIED, PDF at https://www.judiciary.uk/wp-content/uploads/2025/10/Artificial-Intelligence-AI-Guidance-for-Judicial-Office-Holders-2.pdf). Quote: "AI hallucinations are incorrect or misleading results that AI models generate."
- Same guidance, on checking. Quote: "The accuracy of any information you have been provided by an AI tool must be checked before it is used or relied upon."
- High Court, R (Ayinde) v London Borough of Haringey and Al-Haroun v Qatar National Bank [2025] EWHC 1383 (Admin), 6 June 2025 (VERIFIED, https://www.judiciary.uk/judgments/ayinde-v-london-borough-of-haringey/). Lawyers put fake case citations produced by AI before the court. Quotes: "those coherent and plausible responses may turn out to be entirely incorrect" and "They may cite sources that do not exist."
- FSB, 3 February 2026 (VERIFIED, section 7), a plain version for small firms: "AI models are prediction engines, not truth engines."

### 8.2 Liability of a UK business for what its AI told customers

- **No UK court or tribunal decision holding a business liable for a statement made by its own chatbot was found.** Status: searched; not exhaustive. Word it as "we found no reported UK case".
- **UK regulatory decisions do exist.** The ASA upheld complaints where the false claim came from an AI tool (CC Response NW, 29 April 2026, and BCCR, 1 October 2025, both in 2.6). These are advertising rulings, not damages awards, but they show the business answering for the output.
- **The statute that would be used.** Consumer Rights Act 2015, section 50(1): what a trader tells a consumer about a service can become a term of the contract. Law. VERIFIED. https://www.legislation.gov.uk/ukpga/2015/15/section/50 Quote: "anything that is said or written to the consumer, by or on behalf of the trader, about the trader or the service". Applying this to a chatbot on a pub's booking page is the researcher's inference: no UK case confirms it.
- **The leading foreign example.** Moffatt v Air Canada, 2024 BCCRT 149, British Columbia Civil Resolution Tribunal, 14 February 2024. Canadian, not binding in the UK. VERIFIED at the tribunal's site. https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do Quote: "It should be obvious to Air Canada that it is responsible for all the information on its website."
- **Expert statement on English law.** The UK Jurisdiction Taskforce has published a legal statement, "Liability for AI Harms under the private law of England and Wales". Its existence is VERIFIED (https://lawtechuk.io/ukjt/liability-for-ai-harms-under-the-private-law-of-england-and-wales/). The page describes it as a "Legal Statement on liability for non-deliberate AI harms under English private law". Its content was not readable, so the reported conclusion (existing law can make a business liable for false chatbot statements) is SECONDARY. It is an expert statement, not legislation or a judgment, and it covers England and Wales only.
- A reported German appeal court decision on a medical practice's chatbot (Hamm): SECONDARY only and not UK law. Leave out or attribute carefully.

---

## 9. Differences between England, Wales, Scotland and Northern Ireland

| Area | Position |
|---|---|
| Data protection (UK GDPR, Data Protection Act 2018, Data (Use and Access) Act 2025) | UK wide. One regulator, the Information Commission (ICO). |
| Fake reviews and unfair trading (DMCC Act 2024) | UK wide. The CMA enforces across the UK. Other enforcers named in section 151 include every local weights and measures authority in Great Britain (Trading Standards) and the Department for the Economy in Northern Ireland (VERIFIED, https://www.legislation.gov.uk/ukpga/2024/13/section/151). |
| Advertising (CAP Code, ASA) | UK wide. |
| Copyright (CDPA 1988) | UK wide. |
| Allergen law | Same core duty everywhere, different instruments and regulators. England and Wales: assimilated Regulation 1169/2011 with the Food Information Regulations 2014 and the Welsh equivalent. Northern Ireland: Regulation 1169/2011 applies as EU law with the Northern Ireland regulations. FSA guidance covers England, Wales and Northern Ireland. Scotland has its own regulator, Food Standards Scotland, and its own guidance. VERIFIED from FSA best practice guidance, paragraphs 8 and 15, and the FSS pages. The Scottish regulations themselves were not opened. |
| Equality in employment | Equality Act 2010 covers England, Wales and Scotland (VERIFIED from the extent shown on legislation.gov.uk). Northern Ireland has separate equality legislation and its own bodies: not checked in this session, UNVERIFIED. |
| Acas | Its AI tips draw on surveys in Great Britain. Acas's remit and the Northern Ireland equivalent were not checked in this session: UNVERIFIED. |
| Workplace monitoring consultation (2026) | England, Scotland and Wales (VERIFIED). |
| Judicial AI guidance, UKJT legal statement | England and Wales only. |
| EHRC guidance | England, Scotland and Wales. |

---

## 10. Proposed house rules

Eight rules, each tied to a source and marked by type. Wording is a starting point for the editor.

1. **Keep customer, staff and allergy details out of free or personal AI accounts.** Use a business plan that comes with a data processing agreement and has training switched off, or take the names out first.
   - Law: a processor needs a written contract (UK GDPR Article 28(3)); special category data needs an Article 9 condition.
   - Regulator guidance: ICO on processors and separate controllers (1.3).
   - Good practice: NCSC, "not to include sensitive information in queries to public LLMs".
   - Provider terms: personal tiers may train on your content (1.9).
2. **A named person checks every AI output before it is used.** The business answers for it, not the tool.
   - Regulator guidance: ICO, "organisations must check that the outputs are accurate".
   - Advertising code: ASA, "the advertiser remains responsible for any output used in their ads".
   - Good practice: Acas, NCSC, FSB.
3. **Never let AI decide what is in a dish.** Allergen information comes from your recipes and supplier specifications and is signed off by a trained person.
   - Law: Regulation 1169/2011 Article 8(2), "shall ensure the presence and accuracy of the food information".
   - Regulator guidance: FSA, "must be accurate, however it is provided".
4. **AI never writes a review.** No invented testimonials, no staff reviews, no hidden rewards for five stars. AI may help draft your reply to a real review, and you check it.
   - Law: DMCC Act 2024, Schedule 20 paragraph 13, in force 6 April 2025. Fines up to 10% of turnover.
   - Regulator guidance: CMA208.
   - The point about replies is an inference (2.4).
5. **Pictures and adverts must show what customers will actually get.** Saying "made with AI" does not fix a misleading image.
   - Advertising code: CAP News 29 May 2025 and 11 June 2026.
   - Ruling: ShroomIQ, 22 April 2026.
   - There is no legal duty to label AI content.
6. **People decide about people.** A manager makes hiring, pay, discipline and dismissal decisions. Tell applicants and staff where AI or monitoring is used.
   - Law: UK GDPR Articles 22A to 22C (in force 5 February 2026); Equality Act 2010 section 39.
   - Regulator guidance: ICO on recruitment and on monitoring workers.
7. **Tell your customers and staff.** Update your privacy notice to say which AI tools handle personal data and why. Put up the CCTV signs, and do not add face recognition without advice.
   - Regulator guidance: ICO (1.7, 1.10).
   - Ruling: ICO enforcement against Serco Leisure, 23 February 2024.
8. **Write it down on one page.** Which tools are approved, what must never go in, who checks, who to tell when something goes wrong. Talk it through with the team.
   - Good practice: Acas, "Employers should develop clear policies regarding the use of AI at work".
   - Good practice: FSB.

Possible swap or ninth rule for the online version: **Do not bank on owning what AI makes.** Copyright in purely AI generated work is uncertain and the government proposes to remove the special protection (3.2). Check for copied logos or look-alike artwork before you print it.

---

## 11. Uncertain, disputed or likely to change

Likely to change soon:

- ICO final guidance on automated decision-making and profiling is due "Winter 2026". The current employment, CCTV and AI guidance pages are all marked under review.
- An ICO statutory code of practice on AI and automated decision-making is in development. No date found.
- The government is analysing responses to the workplace monitoring technologies consultation that closed on 30 September 2026. New duties on employers are possible.
- Copyright and AI: no legislation, a proposal to remove protection for computer generated works, a new administration since July 2026 and active select committee correspondence.
- The CMA's first fake review cases under the 2024 Act (including Just Eat and Pasta Evangelists) are undecided. The next case update is listed for winter 2026 to 2027. Outcomes will show how fines are set.
- The FSA's best practice allergen guidance was scheduled for review in September 2026. No revised version was found.
- The FSA has been advised by its Science Council to issue AI guidance for food businesses. None found yet.
- DSIT has promised governance guidance aimed at small firms. Not found.
- Suppliers change their data terms frequently. Microsoft moved to a new consumer Copilot app on 18 August 2026 with a separate privacy article that was not read.

Disputed or unsettled:

- Whether an AI supplier is a processor, joint controller or separate controller. The ICO's published view comes from a consultation response and case by case advice. Industry disagrees with parts of it.
- Whether purely AI generated work has copyright under section 9(3). The government's own report says the position is unclear without case law.
- Whether a business is bound by what its chatbot tells a customer. Strong arguments say yes (Consumer Rights Act 2015 section 50, the UKJT statement, the Canadian case), but no UK decision was found.
- Whether using AI to draft replies to genuine reviews raises any issue. Not addressed by the CMA. The view in 2.4 is a reading of the statute.

Could not be verified in this session:

- Any reported UK incident of AI generated allergen information being wrong.
- Any ASA ruling on AI generated images in a pub, restaurant or hotel advert (the database search found none).
- The EU AI Act position in Northern Ireland.
- Northern Ireland equality law and the Northern Ireland counterpart to Acas.
- The EHRC supported Uber Eats face recognition case.
- British Business Bank guidance on AI.
- The findings in Getty Images v Stability AI (citation and date only were confirmed).
- The content of the Joint Committee on Human Rights report of 14 September 2026 and the AI minister's letter of 23 September 2026.
- Whether any regulations have been made under the new Article 22D power to define "meaningful human involvement".
- The December 2024 date of the ICO's generative AI consultation response (the page is undated).

---

## 12. Short source list by publisher

- **Legislation (legislation.gov.uk):** UK GDPR Article 28; Data (Use and Access) Act 2025 sections 80 and 136; SI 2026/82; DMCC Act 2024 Schedule 20 paragraph 13 and section 237; SI 2025/272; Copyright, Designs and Patents Act 1988 sections 9, 12, 178; Regulation (EU) 1169/2011 Article 8; Equality Act 2010 sections 39 and 109; Consumer Rights Act 2015 section 50.
- **ICO (ico.org.uk):** Innovation Advice previously asked questions; Contracts guide; Special category data; generative AI consultation response; DUAA guide for organisations; plans for guidance; CCTV and face recognition guidance; monitoring workers guidance; Serco Leisure notice; recruitment news items of 6 November 2024 and 31 March 2026; small organisations blog on AI cyber threats.
- **CMA (gov.uk):** CMA208 fake reviews guidance; press releases of 7 April 2025, 13 February 2026 and 27 March 2026; Pasta Evangelists case page.
- **ASA and CAP (asa.org.uk):** CAP News of 31 August 2023, 29 May 2025 and 11 June 2026; rulings listed in 2.6.
- **FSA and FSS:** Allergen guidance for food businesses; technical guidance; best practice guidance; Science Council AI report; FSS guidance research; FSS managing allergens page.
- **Government (gov.uk):** Report on Copyright and Artificial Intelligence; King's Speech 2026 briefing; DUAA commencement plans; Responsible AI in Recruitment; AI Playbook; AI Management Essentials response; AI Risk Management Toolkit; workplace monitoring technologies consultation.
- **NCSC, Acas, FSB, EHRC, Judiciary:** as cited in sections 5, 7 and 8.
- **UK Parliament:** bills service (bill 4288); committees data service.
- **European Commission:** AI Act policy page and AI Act Service Desk.
- **Suppliers:** OpenAI, Microsoft, Google pages in 1.9.
