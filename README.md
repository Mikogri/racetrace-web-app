# RaceTrace Web

Frontend RaceTrace do analizy wyników downhill: ranking, profile zawodników, wyniki i Analytics rund, porównania, Live Timing oraz Fantasy. React 19 i TypeScript działają na Vite; TanStack Query obsługuje zapytania, Zod waliduje odpowiedzi, a Recharts rysuje wykresy. Obliczenia sportowe wykonuje sąsiednie API .NET, nie interfejs.

## Praca lokalna

Wymagane są Node zgodny z wersją Vite oraz pnpm. Z katalogu repozytorium:

```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Uruchom również `racetrace-api` na porcie 5017 albo ustaw serwerowy `API_PROXY_TARGET`. Proxy Vite pobiera lokalny sekret API z .NET User Secrets (`racetrace-api-2026`) lub `API_READ_SECRET` i dodaje go do żądań `/api`. Nie umieszczaj sekretów w zmiennych `VITE_*`: są publiczne. `VITE_API_BASE_URL` ustawia bazowy adres, a `VITE_API_TIMEOUT_MS` limit czasu (domyślnie 12 s). Produkcja wymaga osobnej konfiguracji routingu SPA i autoryzowanego proxy; serwer deweloperski nie jest hostingiem produkcyjnym.

`src/features/` grupuje strony i ich hooki, `src/components/` zawiera wspólny UI, `src/lib/api-client.ts` obsługuje HTTP, a `src/styles/tokens/` design system. Filtry i wybór riderów są synchronizowane z URL. Błędy i odświeżanie korzystają ze wspólnych stanów aplikacji.

## Kontrakty i dokumentacja

API i frontend używają `camelCase`. Po zmianie API uruchom `pnpm contracts:export`, `pnpm contracts:generate`, `pnpm contracts:check` i `pnpm contracts:test`; nie edytuj ręcznie wygenerowanych typów. Komendy wymagają sąsiedniego repozytorium API i .NET.

Wspólna dokumentacja jest utrzymywana w repozytorium backendu:

- [Architektura](https://github.com/Mikogri/racetrace-api/blob/main/docs/ARCHITECTURE.md)
- [API i kontrakty](https://github.com/Mikogri/racetrace-api/blob/main/docs/API.md)
- [Algorytmy](https://github.com/Mikogri/racetrace-api/blob/main/docs/ALGORITHMS.md)
- [Dane i cache](https://github.com/Mikogri/racetrace-api/blob/main/docs/DATA_PIPELINE.md)
- [Round Analytics](https://github.com/Mikogri/racetrace-api/blob/main/docs/ROUND_ANALYTICS.md)
- [Predykcje i Fantasy](https://github.com/Mikogri/racetrace-api/blob/main/docs/PREDICTIONS.md)
- [Wydajność i diagnostyka](https://github.com/Mikogri/racetrace-api/blob/main/docs/PERFORMANCE.md)

Lokalnie te same dokumenty znajdują się w sąsiednim `racetrace-api/docs/`. Linki GitHub wskazują gałąź `main` i wymagają opublikowania zmian dokumentacji w repozytorium API.
