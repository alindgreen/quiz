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

## Gør dine egne spørgsmål til standard for alle

Ændringer i editoren gemmes kun i din egen browser. Vil du have, at alle der
åbner linket ser din quiz: eksportér den som `.json` og importér den på den
computer, der styrer spillet — eller bed om at få eksempel-quizzen i
`public/index.html` skiftet ud med dine spørgsmål.
