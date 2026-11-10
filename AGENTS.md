## Formatting

Use npm and `npm ci` with the committed `package-lock.json`; do not add another package manager or lockfile. Use the exact local Prettier version in `package.json`, with default rules from `.prettierrc.json`. Run `npm run format` after source changes and `npm run format:check` before completing work. Do not hand-format code or add competing formatters or stylistic ESLint rules. Respect `.prettierignore`; generated contracts, build artifacts and existing database migrations must remain untouched. Install the recommended VS Code extension for format-on-save. Preserve unrelated local edits.

## Dokumentacja

Przy zmianach w kodzie aktualizuj odpowiednią dokumentację, jeśli zmiana wpływa na architekturę, kontrakty, przepływ danych, algorytmy lub zachowanie systemu. Dokumentacja musi opisywać aktualną implementację, a nie historyczne założenia. Nie twórz nowego pliku dokumentacji, jeśli informację można dopisać do istniejącego.

Wspólna dokumentacja jest utrzymywana w repozytorium `racetrace-api`, w katalogu `docs/`. Odnośniki znajdują się w `README.md` tego repozytorium. Nie duplikuj jej lokalnie.
