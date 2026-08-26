Site chrome; cream bar, ink rule, one orange CTA. Below 880px it swaps to a Menu button opening a full-screen ink panel with display-weight links.

```jsx
<Header
  items={[{label:'Growth problems',href:'/problems',current:true},{label:'How we work',href:'/method'},{label:'Results',href:'/results'},{label:'Insights',href:'/insights'},{label:'About',href:'/about'}]}
  cta={{label:'Bring us the problem',href:'/start'}}
  logo={<img src="assets/logo-horizontal.png" alt="Orange Jelly" style={{height:36,display:'block'}} />}
/>
```

Active page gets an orange underline. Default brand is the two-tone type wordmark when no logo file is passed.
