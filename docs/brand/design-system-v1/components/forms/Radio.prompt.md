Radio option; share a `name` across the group. Wrap the group in a `Field` for its label.

```jsx
<Field label="Where is the pressure?">
  <Radio name="pp" label="Create demand" defaultChecked />
  <Radio name="pp" label="Convert more" />
</Field>
```

Checked = orange fill with ink dot. Use Radio for 2 to 5 mutually exclusive options; use Select beyond that.
