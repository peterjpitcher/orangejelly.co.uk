Site chrome; cream bar, ink rule, one orange CTA. Below 880px it swaps to a Menu button opening a full-screen ink panel with display-weight links.

```jsx
<Header
  items={[
    {label:'Growth problems',href:'/growth-problems',current:true,sub:[
      {label:'Growth has stalled',href:'/growth-problems/stalled'},
      {label:'Leads are not converting',href:'/growth-problems/conversion'},
      {label:'Margin is under pressure',href:'/growth-problems/margin'},
      {label:'All eight problems',href:'/growth-problems',more:true}]},
    {label:'How we work',href:'/how-we-work'},{label:'Results',href:'/results'},{label:'Insights',href:'/insights'},{label:'About',href:'/about'}]}
  cta={{label:'Bring us the problem',href:'/start-here'}}
/>
```

Rules: active page gets an orange underline; `tone="orange"` is the campaign header for conversion pages ONLY (Start Here, growth-problem pages) — everywhere else stays cream, and the CTA flips to ink for contrast. `sub` groups appear only in the mobile drawer (grouped section with smaller links; `more:true` styles the "view all" row); desktop stays a flat bar. Default brand is the two-tone type wordmark when no logo file is passed.
