# gitchat reviewer notes

## Architecture

This is a small React/TypeScript browser application centered on a single `Formatter` component in `formatter.tsx`. `index.tsx` is the entry point: it locates the HTML root, mounts the component with React `StrictMode`, and fails fast if the root is missing. Formatting logic is kept as a local pure helper, while UI state and clipboard interaction remain in the component.

## Conventions

- Use TypeScript types for constrained UI values: `formatter.tsx` defines the `Format` union and initializes state with `useState<Format>("uppercase")`.
- Keep text transformations pure and centralized in `formatText(value, format)` rather than embedding transformation logic in JSX (`formatter.tsx`).
- Form controls are controlled React elements: `textarea` binds `value`/`onChange`, and `select` binds `value`/`onChange` (`formatter.tsx`).
- Associate labels and controls with matching `htmlFor`/`id` values (`format` and `input` in `formatter.tsx`).
- Preserve accessibility behavior for generated output: the result uses `<output className="result" aria-live="polite">` (`formatter.tsx`).
- Use explicit button semantics for non-submit actions: the copy control has `type="button"` and is disabled when there is no result (`formatter.tsx`).
- Component-specific styling may be inline, while reusable button/result styles are imported from CSS (`formatter.tsx` imports `./button.css` and uses `button`/`result` classes).
- The application entry point must validate the mount element before calling `createRoot`; follow the existing explicit error pattern in `index.tsx`.
- Render the application under `<StrictMode>` as shown in `index.tsx`.

## Watch out for

- Do not bypass the `Format` union with new arbitrary format strings. If adding a format, update the union, `formatText` switch, and the corresponding `<option>` in `formatter.tsx`.
- Review changes to `titlecase` carefully: `/\b\w/g` is ASCII-oriented and does not provide full Unicode-aware title casing.
- Clipboard writes can reject (permissions, insecure contexts, or unsupported browsers); changes to `copyResult` should handle failures rather than leaving an unhandled promise rejection.
- Preserve the empty-result behavior: the copy button is disabled when `result` is empty, and the result announcement remains live.
- Avoid moving the root lookup after `createRoot`; `index.tsx` intentionally throws a clear error when the required HTML element is absent.