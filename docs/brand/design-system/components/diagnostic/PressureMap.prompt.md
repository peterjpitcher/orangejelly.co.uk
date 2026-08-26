The signature diagnostic asset. Radial network (`variant="map"`) for method/case pages; six-tile grid (`variant="grid"`) for problem pages and results.

```jsx
<PressureMap caption="Example: 12-month growth partnership, month 3." />
<PressureMap variant="grid" areas={[{id:'margin',label:'Margin',pressure:3,note:'Discount-led demand'} /* … */]} />
```

Pressure levels: 0 steady · 1 watch · 2 pressure · 3 critical — encoded as node size + fill (paper → peach → orange → ember). `highlight={['margin','operations']}` dims everything else; `onSelect` makes nodes clickable. Never present it as a score out of 100.
