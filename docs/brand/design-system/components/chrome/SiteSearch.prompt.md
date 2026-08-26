Search with input, highlighted results and a no-results state that routes onwards.

```jsx
<SiteSearch items={searchIndex} fallback={{label:'Browse growth problems',href:'/growth-problems'}} />
```

`items` takes the existing search-index JSON (`{title,href,category,excerpt}`). The no-results state must always offer a route out — never an empty box.
