# gitchat reviewer notes

## Architecture

This is a small TypeScript/React application whose browser entry point is `index.tsx`. The primary UI is the controlled `Formatter` component in `formatter.tsx`, while `reviewScore.ts` contains a separate async review-scoring service defined around injected repository/context interfaces rather than direct API or database access.

## Conventions

- Use strict TypeScript domain types and string unions for constrained values. `formatter.tsx` defines `Format` and stores it in `useState<Format>`.
- React components are default-exported from lowercase `.tsx` files and mounted explicitly from `index.tsx`; the root element is validated before calling `createRoot`.
- Keep form controls controlled: `Formatter` binds `text` and `format` to state and updates them through `onChange`.
- Prefer semantic/accessibility-linked markup: labels use `htmlFor` matching control IDs, and the result uses `<output aria-live="polite">`.
- Keep formatting logic separate from rendering in a small function (`formatText` in `formatter.tsx`) with a `switch` over the `Format` union.
- UI styling is mixed deliberately between inline layout styles and stylesheet classes. For example, layout is inline in `formatter.tsx`, while the result heading/button styling uses `button.css` and classes such as `button` and `result-heading`.
- Review scoring uses dependency injection through `ReviewScoreContext`. External operations are represented by async methods such as `getChangedFiles`, `getReviewComments`, and `saveReviewScore`, allowing the scoring function to remain independent of transport/storage.
- Scoring is accumulated imperatively, then bounded before persistence. `calculateReviewScore` clamps values to the range 1–5 and saves using the pull request ID.

## Watch out for

- Preserve the scoring order in `reviewScore.ts`: unusually large changes can set the score to 5 and break file processing, while draft pull requests later set the score to 0 before the final lower-bound clamp. Changes to ordering alter behavior.
- Do not bypass `ReviewScoreContext` with direct API/database calls inside `calculateReviewScore`; callers provide those integrations through `this`.
- Ensure every scoring path that is expected to persist a result calls `saveReviewScore`. The current empty/null changed-file path returns `5` early and does not save.
- Treat filename checks as literal substring/suffix rules: `"test"` matches anywhere, and `.ts`/`.tsx` checks are case-sensitive.
- Clipboard use in `copyResult` is asynchronous and currently has no failure handling; changes should avoid reporting “Copied!” when `navigator.clipboard.writeText` rejects.
- Preserve the controlled textarea/select behavior and stable element IDs when modifying the formatter UI.