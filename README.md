# Race Trace MTB Web

Frontend Race Trace MTB do analizy wyników downhill: ranking, profile zawodników, wyniki i Analytics rund, porównania, Live Timing oraz Fantasy. React 19 i TypeScript działają na Vite; TanStack Query obsługuje zapytania, Zod waliduje odpowiedzi, a Recharts rysuje wykresy. Obliczenia sportowe wykonuje sąsiednie API .NET, nie interfejs.

## Praca lokalna

Wymagane są Node zgodny z wersją Vite oraz pnpm. Z katalogu repozytorium:

```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm audit
```

Uruchom również `racetrace-api` na porcie 5017 albo ustaw serwerowy `API_PROXY_TARGET`. Proxy Vite pobiera lokalny sekret API z .NET User Secrets (`racetrace-api-2026`) lub `API_READ_SECRET` i dodaje go do żądań `/api`. Nie umieszczaj sekretów w zmiennych `VITE_*`: są publiczne. `VITE_API_BASE_URL` ustawia bazowy adres, a `VITE_API_TIMEOUT_MS` limit czasu (domyślnie 12 s). Serwer deweloperski nie jest hostingiem produkcyjnym.

## Cloudflare Pages — GitHub deployment

Connect this repository to **Pages**, production branch `main`, repository root `/`, output directory `dist`. Use Node 24 (`.node-version`), build command `npm ci && npm run build`, and build variable `SKIP_DEPENDENCY_INSTALL=true` to avoid a second automatic install with a different package manager. Keep `VITE_API_BASE_URL` empty. No custom domain is required; the initial `*.pages.dev` address works.

Runtime bindings for production:

| Binding | Value |
| --- | --- |
| `API_ORIGIN` | Defined in `wrangler.jsonc`: `https://api.racetracemtb.com` |
| `API_READ_SECRET` | Encrypted Secret in Cloudflare, identical to Railway's read secret; never add its value to Wrangler or Git |

Wrangler is the source of truth for plain runtime `vars`. Change `API_ORIGIN` in the file, not a competing production dashboard variable; existing deployments require a new deployment to receive the change. There are no environment overrides in this repository, so the top-level origin also applies to local Pages runs and previews. Do not bind production read credentials to untrusted previews. Vite development still uses `API_PROXY_TARGET`, independently of Pages runtime bindings. `VITE_API_BASE_URL` must remain empty so browser requests use the same-origin gateway, rather than bypassing it and hitting Railway without authorization. Dashboard Secret bindings remain separate from the plain `vars` map.

`functions/api/[[path]].js` proxies `/api/v1/*` server-side. Browser credentials and cookies are not forwarded. Administrative/import routes and writes are blocked; the only POST exception is the existing read-only live championship projection (body limited to 256 KiB). Upstream redirects are not followed with credentials; public round-image HTTPS redirects are relayed to the browser. API responses are not cached at the edge. `public/_routes.json` keeps static files and SPA routes outside the Function; Pages provides SPA fallback because there is no root `404.html`.

The Function forwards Cloudflare's verified client IP using a private gateway header. Enable `Gateway__Enabled=true` in Railway so the API can apply per-client limits and recognize HTTPS. This header is trusted only with the correct server-side read credential, never merely because a caller supplied it. Keep that credential server-only and distinct from the admin secret. This gateway is public access to read data, not user authentication; provider quotas and edge abuse controls still matter.

Do not provide production secrets to untrusted preview branches. Missing runtime bindings return 503 rather than exposing a credential or falling back to a public backend. Validate deep links, API requests, images and Live Timing on the provider URL before assigning a domain. This setup does not deploy through `vite preview` or GitHub Pages.

GitHub Actions runs installation, lint, types, tests, the gateway checks (`node --test scripts/cloudflare-proxy.check.mjs`), build and dependency audit. It does not deploy or modify the database. Cloudflare Git integration performs deployment separately; require CI checks before merging to `main`. Cross-repository OpenAPI checks still require the sibling API checkout and are not performed by this standalone workflow.

`src/features/` grupuje strony i ich hooki, `src/components/` zawiera wspólny UI, `src/lib/api-client.ts` obsługuje HTTP, a `src/styles/tokens/` design system. Filtry i wybór riderów są synchronizowane z URL. Błędy i odświeżanie korzystają ze wspólnych stanów aplikacji.

## Kontrakty i dokumentacja

`public/sitemap.xml` lists the eight main public routes on the current `https://racetrace-web-app.pages.dev` origin; `public/robots.txt` advertises it. Vite copies both files to `dist`, outside the `/api` Function routes. The sitemap excludes filter URLs, navigation aliases and dynamic rider/round/session detail pages; it does not query the API during builds. Update both files when assigning a custom canonical domain or adding a main route. A sitemap helps discovery but does not guarantee indexing of client-rendered content.

API i frontend używają `camelCase`. Po zmianie API uruchom `pnpm contracts:export`, `pnpm contracts:generate`, `pnpm contracts:check` i `pnpm contracts:test`; nie edytuj ręcznie wygenerowanych typów. Komendy wymagają sąsiedniego repozytorium API i .NET.

Przed wydaniem sprawdź cały graf zależności, nie tylko `pnpm audit --prod`: narzędzia testowe i deweloperski serwer również przetwarzają nieufne wejścia. Aktualizacje bezpieczeństwa powinny przejść testy, lint, build i kontrolę kontraktów. Podstawowy workflow używa pnpm; zachowany `package-lock.json` umożliwia też instalację npm i przy zmianie zależności powinien pozostać zgodny z manifestem. Znane ostrzeżenie peer `openapi-typescript@7.13.0` o TypeScript `^5.x` przy projekcie na TypeScript 6 jest ograniczeniem deklaracji narzędzia; zgodność eksportu i typów sprawdza `contracts:check`, a nie sam brak ostrzeżenia instalatora.

Wspólna dokumentacja jest utrzymywana w repozytorium backendu:

- [Architektura](https://github.com/Mikogri/racetrace-api/blob/main/docs/ARCHITECTURE.md)
- [API i kontrakty](https://github.com/Mikogri/racetrace-api/blob/main/docs/API.md)
- [Algorytmy](https://github.com/Mikogri/racetrace-api/blob/main/docs/ALGORITHMS.md)
- [Dane i cache](https://github.com/Mikogri/racetrace-api/blob/main/docs/DATA_PIPELINE.md)
- [Round Analytics](https://github.com/Mikogri/racetrace-api/blob/main/docs/ROUND_ANALYTICS.md)
- [Predykcje i Fantasy](https://github.com/Mikogri/racetrace-api/blob/main/docs/PREDICTIONS.md)
- [Wydajność i diagnostyka](https://github.com/Mikogri/racetrace-api/blob/main/docs/PERFORMANCE.md)

Lokalnie te same dokumenty znajdują się w sąsiednim `racetrace-api/docs/`. Linki GitHub wskazują gałąź `main` i wymagają opublikowania zmian dokumentacji w repozytorium API.
