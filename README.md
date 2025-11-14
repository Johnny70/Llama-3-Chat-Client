# Llama-3 Chat Client

En modern, modulär chatklient för Llama-server (OpenAI-kompatibel API).

## Funktioner

-   Chatta med Llama-server via OpenAI-liknande API
-   Inställningssida för alla modellparametrar
-   Snygg och responsiv UI med hash-baserad routing
-   Automatisk formatering av serverns svar (markdown till HTML)

## Installation

```bash
npm install
```

## Starta utvecklingsserver

```bash
npm run dev
```

## Bygg för produktion

```bash
npm run build
```

## Struktur

```
src/
  components/   # UI-komponenter
  utils/        # Formatteringshjälp
  style.css     # All CSS
  main.ts       # Appens entrypoint
public/
index.html
```

## Konfiguration

-   Ändra Llama-serverns URL i `src/main.ts` (default: `http://192.168.32.101:8000`)
-   Systemprompten instruerar modellen att alltid svara i ren markdown

## Licens

MIT
