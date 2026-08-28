/**
 * Next 14's App Router resolves `react-dom` to its own vendored build, which
 * exports `useFormState` and `useFormStatus`. The installed @types/react-dom is
 * 18.3 stable and declares them only in its canary entry, so without this the
 * enquiry form's progressive enhancement does not type-check even though it runs.
 *
 * This is the reference Next's own documentation points at. Remove it on React 19,
 * where both hooks are stable (`useActionState` and `useFormStatus` from `react`).
 */
/// <reference types="react-dom/canary" />
