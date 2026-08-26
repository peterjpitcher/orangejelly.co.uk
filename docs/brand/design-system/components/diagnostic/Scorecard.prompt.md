Two-minute self-assessment (intro → 12 questions with progress → pressure-grid result → diagnostic CTA). Replaces the retired pub ROI calculator at step 2 of the conversion ladder.

```jsx
<Scorecard onComplete={a=>track('scorecard_done',a)} cta={{label:'Book a growth diagnostic',href:'/start-here'}} />
```

The result names the heaviest pressure area and frames itself as "a signal, not a diagnosis" — keep that copy pattern if you override it.
