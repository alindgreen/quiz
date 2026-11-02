# Quiz-tavle

Tilpasselig quiz-tavle i Jeopardy-stil: kategorier, point, hold, "Dobbelt op",
nedtælling med tænkemusik og lydeffekter. Hele spillet ligger i
`public/index.html` og kan også åbnes direkte i en browser.

Klik **✎ Tilpas** i spillet for at ændre spørgsmål, udseende, hold, regler og
lyde. Ændringer gemmes i den browser, du bruger, og kan eksporteres/importeres
som `.json` under **Gem & del**.

## Kør lokalt

```bash
npm start      # http://localhost:3000
```

Ingen afhængigheder — kun Node 18+. `server.js` viser quizzen fra `public/`
og gemmer delte quizzer.

## Railway

Railway bygger automatisk fra dette repo (`npm start`). Lav et offentligt link
under **Settings → Networking → Public Networking → Generate Domain**.

### Lagerplads til delte quizzer (Volume)

Delingslinks gemmes på serveren. For at de ikke forsvinder ved hver ny
udrulning, skal servicen have et **Volume**:

1. Åbn projektet på railway.app.
2. Højreklik på quiz-servicen (eller tryk ⌘K og skriv *volume*) → **Attach Volume**.
3. **Mount path:** `/data` → **Add** / **Deploy**.

Serveren finder selv Volumet (`RAILWAY_VOLUME_MOUNT_PATH`). Uden Volume
virker delingslinks kun indtil næste udrulning.

## Multiple choice og spørgsmål med lyd

I editoren kan hvert spørgsmål sættes til **Multiple choice** (2–4
svarmuligheder, markér den rigtige) og/eller få en **lyd/sang** tilknyttet
(med valgfrit starttidspunkt). Sange gemmes i browseren og kommer med, når
quizzen eksporteres som `.json`.

## Del en quiz

Ændringer i editoren gemmes i den browser, du bruger. For at dele en quiz:
**✎ Tilpas → Gem & del → 🔗 Lav delingslink**. Quizzen (inkl. billeder og
sange) uploades til serveren, og du får et kort link (`/q/<id>`), som kopieres
automatisk. Den, der åbner linket, får quizzen indlæst i sin browser.

Du kan også eksportere quizzen som `.json` (inkl. lyd) og importere den igen.
