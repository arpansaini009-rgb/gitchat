# gitchat reviewer notes

## Architecture

This is a small React/TypeScript browser application centered on a single `Formatter` component. `index.tsx` is the entry point: it locates `#root`, mounts the component with React `StrictMode`, and delegates UI/state and formatting behavior to `formatter.tsx`. Formatting is implemented locally as a typed helper rather than through a separate service or state-management layer.

## Conventions

- Use functional React components and hooks; `Formatter` owns its UI state via `useState` in `formatter.tsx`.
- Keep supported formatting operations constrained by the `Format` string union: `"uppercase" | "lowercase" | "titlecase" | "trim"` (`formatter.tsx`).
- Centralize pure text transformation in `formatText(value, format)` rather than embedding transformations in JSX (`formatter.tsx`).
- Form controls are controlled components: `<select>` and `<textarea>` bind their `value` to state and update through `onChange` (`formatter.tsx`).
- Use semantic/accessibility-oriented HTML where present: paired `label`/`htmlFor`, a `type="button"` action button, and an `aria-live="polite"` `<output>` for results (`formatter.tsx`).
- The application expects an HTML element with `id="root"`; startup explicitly throws if it is absent (`index.tsx`).
- Component-specific button styles are imported from `./button.css`, while layout and form styling currently use inline style objects (`formatter.tsx`).
- Clipboard feedback is transient: successful copy sets `copied` and resets it after 1.5 seconds using `window.setTimeout` (`formatter.tsx`).

## Intentional non-standard choices

- Styling is deliberately mixed: the main layout and controls use inline styles, while button/result presentation uses CSS classes from `button.css` (`formatter.tsx`). Do not flag inline styles solely for not being moved to a stylesheet.
- The formatter is rendered under `StrictMode` in the entry point (`index.tsx`); development-only repeated lifecycle behavior is expected.
- The format change handler uses `event.target.value as Format` (`formatter.tsx`) because the browser select value is a generic string while the options are constrained by the union.

## Watch out for

- New format options must be added consistently to the `Format` union, `formatText` switch, and the `<select>` options (`formatter.tsx`).
- Preserve the current controlled-input behavior; introducing an uncontrolled `textarea` or `select` can desynchronize displayed input and computed output.
- Copy actions should not be enabled for an empty result; the existing button uses `disabled={!result}` (`formatter.tsx`).
- Changes to clipboard behavior should account for rejected `navigator.clipboard.writeText` promises; currently `copyResult` has no error handling, so failures should not incorrectly display “Copied!”.
- Avoid removing the root-element guard in `index.tsx`; mounting without `#root` should fail with the existing explicit diagnostic rather than a cryptic DOM error.