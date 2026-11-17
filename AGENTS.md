# Agent instructions

## Commands

- Never run any `npm` commands. This includes `npm install`, `npm ci`, `npm run <script>`, `npm exec`, `npm test`, and `npx`.
- Do not install, update, or remove dependencies, and do not run build, typecheck, render, or dev scripts on the user's behalf.
- The user handles all package management and script execution locally. Make code and config changes only.
