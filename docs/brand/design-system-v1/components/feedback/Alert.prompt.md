Inline notice for form outcomes and page-level messages. Paper block, ink border, thick tone rule on the left.

```jsx
<Alert tone="ok" title="Message sent.">We reply within one working day.</Alert>
<Alert tone="danger" title="That did not send.">Check the email address and try again.</Alert>
<Alert title="One diagnostic slot left in October." onClose={dismiss} />
```

Danger renders `role="alert"`. Keep copy to one or two short sentences; say the important thing first.
