Conversion-chain module: every article links to a problem page, every problem page to a case study, every case study to the offer. `from` sets stage-appropriate defaults.

```jsx
<NextStep from="article" links={[
  {stage:'The problem',title:'Margin is under pressure',desc:'The growth problem behind this article.',href:'/growth-problems/margin'},
  {stage:'The proof',title:'Rebuilt pricing, +9pt gross margin',href:'/results/pricing'}]} />
```

Keep to 1–2 links — the chain is one deliberate step, not a related-posts widget.
