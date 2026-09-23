# gitchat reviewer notes

## Architecture

This is a small React/TypeScript browser app centered on a single `Formatter` component in `formatter.tsx`. `index.tsx` is the entry point: it locates the `#root` element, mounts the component with React `StrictMode`, and fails fast if the root is missing. Presentation is split between inline styles in the component and the imported `button.css`.

## Conventions

- Use functional React components and hooks; `Formatter` owns text, selected format, and copy-status state via `useState` in `formatter.tsx`.
- Keep supported formatting operations explicit through the `Format` string union (`"uppercase" | "lowercase" | "titlecase" | "trim"`), and implement their behavior in the `formatText` switch.
- Derive display values during render rather than storing redundant state: `result` is computed from `text` and `format`.
- Form controls are controlled components. The `<select>` uses `value={format}` and updates via `onChange`; the `<textarea>` similarly binds `value={text}` and `setText`.
- Preserve accessibility-oriented HTML patterns used here: labels connect through `htmlFor`/`id`, the result uses `<output aria-live="polite">`, and the copy control explicitly declares `type="button"`.
- Use inline styles for component layout and control sizing, while shared/button styling is loaded with a stylesheet import (`import "./button.css"` in `formatter.tsx`).
- Mounting should retain the root guard and descriptive error in `index.tsx`; do not silently render when the expected HTML container is absent.
- Copy feedback is transient: successful copying sets `copied` and resets it after 1.5 seconds, with the button disabled when the formatted result is empty.

## Watch out for

- Changes to the format options must update both the `Format` union and the `<option>` elements; the select handler currently relies on `event.target.value as Format`.
- Clipboard operations are asynchronous. New copy behavior should handle `navigator.clipboard.writeText` rejection rather than leaving an unhandled promise and incorrectly implying success.
- Avoid changing `result` to independent state; it is intentionally derived from the current input and format.
- The title-case implementation uses `/\b\w/g`, which is ASCII-oriented and does not provide full Unicode word/casing behavior. Flag changes that claim broader internationalized title casing without corresponding implementation.
- Preserve the empty-result guard on the copy button; otherwise users can invoke clipboard writes for empty content.