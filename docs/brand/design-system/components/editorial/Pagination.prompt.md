```jsx
<Pagination page={4} total={18} hrefFor={n=>`/insights/page/${n}`} />
```

Use `hrefFor` on listings (real links, crawlable); `onPage` only for client-side filtering.
