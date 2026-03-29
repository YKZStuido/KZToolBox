# AGENTS.md

Agent operating guide for `D:\KZToolBox`.
This repository is a Tauri v2 desktop app with a plain JavaScript frontend.

## 1) Repository Scope

- Frontend: `index.html`, `app.js`, `styles.css`
- Backend: Rust Tauri commands in `src-tauri/src/main.rs`
- Tauri config: `src-tauri/tauri.conf.json`
- Package manager: npm (`package-lock.json` present)
- Primary target: Windows 10/11

Notes:
- There is no React/Vue/TypeScript build chain.
- Most system features are Windows-specific (PowerShell + native tools).

## 2) AI Rule Files Present in Repo

Checked rule locations:
- `.cursorrules`: not found
- `.cursor/rules/`: not found
- `.github/copilot-instructions.md`: not found

If any of these files are added later, treat them as higher-priority repository rules and merge them into this guide.

## 3) Build / Run / Check Commands

Run from repository root unless noted.

### Install

- `npm install`

### Run (dev)

- `npm run dev`
  - Starts `tauri dev`
  - Builds Rust backend
  - Launches desktop app

### Build (release pipeline)

- `npm run build`
  - Runs `tauri build`

### Rust checks (run in `src-tauri`)

- `cargo check --no-default-features`
- `cargo build --no-default-features`
- `cargo test --no-default-features`
- `cargo fmt --all`
- `cargo clippy --all-targets --all-features -- -D warnings`

### Frontend checks

- `node -c app.js` (syntax check)
- No dedicated JS lint/test scripts are currently defined in `package.json`.

## 4) Single-Test Commands (important)

Use these when tests exist:

- Run one Rust test by exact name:
  - `cargo test --no-default-features test_name`

- Run one Rust test by module path:
  - `cargo test --no-default-features module::submodule::test_name`

- Run one Rust integration test file:
  - `cargo test --no-default-features --test integration_file_name`

- Run one Rust test with stdout/stderr:
  - `cargo test --no-default-features test_name -- --nocapture`

Tip (Windows process lock issue):
- If Cargo complains about locked files while app is running:
  - `cmd /C "taskkill /IM kztoolbox.exe /F"`
  - then rerun cargo command

## 5) Architecture Notes for Agents

- `tools[]` metadata in `app.js` drives tool list rendering.
- Each tool usually has a `renderXxx` function.
- Shared UI helpers exist (tables, empty state, formatting helpers).
- Frontend-to-backend calls go through `invoke(...)`.
- Backend commands use `#[tauri::command]` and are registered in `main()`.
- Many backend commands execute PowerShell and parse JSON output.
- Image/file tools are mostly frontend-first: local file input -> preview/meta -> helper-driven export/download.
- `renderImageResizeTool(...)` is the closest pattern for new image utilities; it reuses `createFileMetaGrid(...)`, Canvas export, and Tauri save fallback.
- `exportCanvasImage(...)` and `save_image_to_source_dir(...)` implement the standard save strategy: prefer original source directory in Tauri when `file.path` is available, otherwise download in the frontend.
- Browser-preview mode is a real supported path across tools; many features intentionally degrade when Tauri-only capabilities are unavailable.
- `app.js` also lazy-loads browser runtimes from CDN for some tools (Prettier, Highlight.js), so avoid assuming every capability is purely local/offline.
- QR recognition depends on `BarcodeDetector`; treat WebView2/browser support as a runtime capability check, not a guaranteed feature.

## 6) Code Style Guidelines

### General principles

- Make minimal, scoped changes.
- Prefer readability over clever abstractions.
- Preserve existing Chinese UI wording style unless asked otherwise.
- Avoid adding dependencies unless clearly justified.
- Keep behavior backward-compatible when possible.

### JavaScript (`app.js`)

- Use `const` by default; `let` only when reassignment is required.
- Use semicolons and 2-space indentation.
- Naming:
  - variables/functions: `camelCase`
  - tool ids / DOM ids: `kebab-case`
  - renderers: `renderXxx`
- Prefer early returns for invalid input and error branches.
- Wrap async operations in `try/catch`.
- Surface user-friendly errors in panel output (not just console).
- Escape dynamic HTML content via `escapeHtml(...)`.
- Normalize uncertain array/object payloads with `normalizeArray(...)`.

### CSS (`styles.css`)

- Reuse existing design tokens in `:root`.
- Keep class naming and visual style consistent with existing patterns.
- Prefer additive styles over broad resets.
- Validate desktop + narrow-width behavior after changes.

### Rust (`src-tauri/src/main.rs`)

- Use Rust 2021 idioms and `snake_case` names.
- Keep imports explicit and organized.
- Tauri command boundary convention:
  - `Result<T, String>` with meaningful context in errors.
- Use `map_err(...)` with actionable error text.
- Sanitize/escape interpolated user input in shell/PowerShell scripts.
- Favor bounded execution (timeouts) for external command calls.
- Avoid panics in command paths; return recoverable errors instead.

### Types and data contracts

- Keep frontend/backend command names aligned exactly.
- Prefer extending JSON payloads over breaking key renames.
- Keep response shape stable for existing UI components.

## 7) Error Handling Rules

- Backend:
  - Return contextual messages (`what failed` + `why`).
  - Do not leak raw panic traces to UI.
- Frontend:
  - Show clear panel-state errors for user actions.
  - Keep UI responsive on partial failures.
- For slow operations:
  - show loading text
  - handle timeout/failure gracefully

## 8) Editing and Refactor Boundaries

- Do not perform broad style-only rewrites.
- Do not rename many keys/functions unless necessary.
- Keep feature work isolated from unrelated areas.
- If changing command signatures, update both Rust and JS in same change.

## 9) Suggested Validation Before Handoff

- Start app: `npm run dev`
- If JS changed: `node -c app.js`
- If Rust changed: `cargo check --no-default-features` in `src-tauri`
- Open impacted tool panel(s) and execute the new/changed flow.
- Verify no obvious encoding/garbled text issues in Chinese UI strings.
- For image export tools, verify both save paths when relevant: source-directory save in Tauri and browser-download fallback when no source path is available.
- For image/Base64 flows, verify both raw Base64 and `data:image/...;base64,...` inputs.

## 10) If You Add Tooling Later

- Add commands to `package.json` and/or Cargo config.
- Update this AGENTS.md with exact command lines.
- Document single-test invocation patterns for the new test framework.

## 11) Non-Goals / Assumptions to Avoid

- Do not assume frontend unit tests exist.
- Do not assume ESLint/Prettier CLI scripts exist.
- Do not assume cross-platform parity for Windows-only commands.
- Do not assume the app runs in browser-only mode for system features.
