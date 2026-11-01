# Quiz-tavle

Tilpasselig quiz-tavle i Jeopardy-stil: kategorier, point, hold, "Dobbelt op",
nedtælling med tænkemusik og lydeffekter. Hele spillet ligger i
`public/index.html` og kan også åbnes direkte i en browser.

Klik **✎ Tilpas** i spillet for at ændre spørgsmål, udseende, hold, regler og
lyde. Ændringer gemmes i den browser, du bruger, og kan eksporteres/importeres
som `.json` under **Gem & del**.

## Kør lokalt

```bash
npm install
npm start      # http://localhost:3000
```

## Railway

Railway bygger automatisk fra dette repo (Node: `npm install` + `npm start`).
Serveren lytter på den port, Railway giver i `PORT`. Lav et offentligt link
under **Settings → Networking → Generate Domain**.

## Del en quiz

Ændringer i editoren gemmes i den browser, du bruger. For at dele en quiz:
**✎ Tilpas → Gem & del → 🔗 Lav delingslink**. Linket indeholder hele quizzen
(spørgsmål, udseende, hold og regler) og kopieres automatisk. Den, der åbner
linket, får quizzen indlæst i sin browser.

Uploadede billeder og egne lydfiler kommer ikke med i linket (brug billeder
som link `https://…`, hvis de skal med). Du kan også eksportere/importere
quizzen som `.json`-fil.
