# Surveys: build or adopt

**Date:** 22 September 2026. Licences, stars and last activity read live from GitHub that day.

**Outcome:** build in-repo (Peter, 22 September 2026). Every polished open-source builder is
AGPL, which the workspace gate keeps out of this repo, and none of the MIT options produce
a shareable, BuzzFeed-style result. The parts that make a survey spread (one question per
screen, a results screen, a link preview that sells it) are cheap to build on what the site
already has: Supabase, the Postgres rate limiter, `next/og` share cards, framer-motion and
first-party event tracking.

| Repository | Licence | Stars | Verdict |
|---|---|---|---|
| formbricks/formbricks | AGPL-3.0, plus paid enterprise parts | 13.0k | Strong, but AGPL, and built for product feedback |
| heyform/heyform | AGPL-3.0 | 9.0k | Typeform-style forms; AGPL |
| OpnForm/OpnForm | AGPL-3.0, plus enterprise parts | 3.7k | Forms; AGPL |
| baptisteArno/typebot.io | FSL-1.1-Apache-2.0 | 10.4k | Chatbot builder, a separate app to host; source-available, not open source |
| LimeSurvey/LimeSurvey | GPL-2.0 or later | 3.7k | Research surveys in PHP; GPL |
| surveyjs/survey-library | MIT | 4.9k | Usable runner, but the builder (survey-creator) needs a paid commercial licence, and it looks like a form |
| quillforms/quillforms | LGPL-3.0 | 621 | Typeform-like React, tied to WordPress |
| wingkwong/react-quiz-component | MIT | 402 | Right-or-wrong trivia only |
| amamenko/react-buzzfeed-quiz | MIT | 26 | Right idea, no code changes since July 2022; reference only |
| nygardk/react-share | MIT | 2.8k | Share buttons; not needed, share links are plain URLs |
