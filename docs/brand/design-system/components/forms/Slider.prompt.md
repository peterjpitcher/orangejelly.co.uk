Range input for calculator-style estimates. Pair with a `Stat` showing the derived number — evidence is the design asset.

```jsx
<Field label="Covers per week" hint="Drag to estimate">
  <Slider min={50} max={2000} step={10} defaultValue={400} onChange={e=>setCovers(+e.target.value)} />
</Field>
```

Orange fill = progress; thumb is a square pressure block. Works controlled (`value`) or uncontrolled (`defaultValue`).
