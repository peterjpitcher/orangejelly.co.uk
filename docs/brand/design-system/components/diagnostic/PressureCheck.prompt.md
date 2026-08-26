Interactive problem selector built on PressureMap: symptom buttons on the left, map highlights connected areas, cause panel + diagnostic CTA appear on pick.

```jsx
<PressureCheck onCta={()=>go('/start-here')} />
```

Defaults carry the six blueprint symptoms ("Growth has stalled", "Leads are not converting" …). Override `symptoms` to tailor per page; keep 4–6 items or the side column overflows.
