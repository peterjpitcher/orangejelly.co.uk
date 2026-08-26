Dialog on an ink scrim; paper panel with the hard pressure shadow. Esc, scrim click and the × all close it.

```jsx
<Modal open={show} onClose={()=>setShow(false)} eyebrow="Before you go" title="Leaving with the problem unsolved?"
  actions={<><Button arrow onClick={book}>Book a growth diagnostic</Button><Button variant="ghost" onClick={()=>setShow(false)}>Not now</Button></>}>
  <p>Tell us what is happening. Twenty minutes, no pitch, straight answers.</p>
</Modal>
```

One modal per page at most. For exit intent, trigger on `mouseleave` toward the viewport top, once per session.
