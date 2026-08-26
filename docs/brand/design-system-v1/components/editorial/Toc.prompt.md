Contents rail for articles over ~1200 words; sits in a sticky sidebar next to `.oj-prose` copy.

```jsx
<div style={{position:'sticky',top:96}}>
  <Toc current={activeHref} items={[
    {label:'The real cost of a discount',href:'#cost'},
    {label:'Worked example',href:'#example',level:3},
    {label:'What to do instead',href:'#instead'}
  ]} />
</div>
```

Feed `current` from an IntersectionObserver on the article headings for the orange in-view marker.
