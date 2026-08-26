Trust strip of partner or client marks; greyscale keeps orange as the only signal colour.

```jsx
<LogoStrip label="In partnership with" items={[
  {src:'assets/partners/greene-king.svg',alt:'Greene King',height:34},
  {src:'assets/partners/bii.svg',alt:'BII'},
  'The Anchor'
]} />
```

Strings render as type-only marks for partners without a usable logo file. `tone="dark"` on ink sections.
