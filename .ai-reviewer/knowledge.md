# gitchat reviewer notes

## Architecture

This is a small React/TypeScript browser application centered on a single `Formatter` component in `formatter.tsx`. `index.tsx` is the entry point: it finds the `#root` DOM node, mounts the component with React `StrictMode`, and fails fast if the root is missing. Formatting logic is kept as a pure `formatText` helper, while UI state and clipboard behavior remain in the component.

## Conventions

- Use TypeScript union types for finite UI choices; `formatter.tsx` defines `Format` as `"uppercase" | "lowercase" | "titlecase" | "trim"`.
- Keep formatting behavior pure and centralized in `formatText(value, format)` rather than embedding transformations directly in JSX.
- Use controlled form elements: the `<select>` and `<textarea>` derive their values from `useState` and update through `onChange`.
- Associate labels and controls with matching `htmlFor`/`id` values (`format` and `input`) in `formatter.tsx`.
- Use semantic HTML for output and status updates: the result is rendered in `<output className="result" aria-live="polite">`.
- Buttons that perform actions explicitly use `type="button"`; the copy button is disabled when there is no result.
- Component-specific styling is mixed deliberately: layout and form styling use inline `style` objects, while button/result styles are supplied through `./button.css` imported by `formatter.tsx`.
- The application entry point validates the mount target before calling `createRoot`; preserve the explicit error in `index.tsx` when changing bootstrapping.

## Watch out for

- Preserve the `Format` union and keep select values synchronized with its allowed cases; avoid accepting arbitrary strings through unsafe casts or adding options without updating `formatText`.
- Clipboard operations are asynchronous. Changes to `copyResult` should account for rejected or unavailable `navigator.clipboard` calls rather than always showing “Copied!”.
- The copied-state timeout is not cancelled on unmount; avoid introducing lifecycle-sensitive changes without clearing pending timers.
- `titlecase` uses `/\b\w/g`, which is an ASCII-oriented implementation and may not correctly title-case Unicode or punctuation-heavy text. Treat changes to its semantics as deliberate behavior changes.
- Keep the result’s `aria-live` behavior intact when changing the output markup or copy feedback.