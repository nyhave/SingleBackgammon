# Matchmaking & Feed Regler 🎲❤️

Dette dokument beskriver logikken bag, hvordan modstandere (og potentielle dates) udvælges og vises i brugerens feed på "FIND MODSTANDERE" (Matchmaking) skærmen. 

Målet er at skabe et feed, der balancerer *gode backgammon-kampe* med *høj dating-kompatibilitet*.

## 1. Hard Filters (Absolutte Krav)
Disse filtre sorterer brugere fuldstændig fra, hvis de ikke matcher. Det sikrer, at brugeren ikke spilder tid på folk uden for deres grundlæggende præferencer.

* **Køn/Seksualitet:** Matcher brugerens "Søger" præference (f.eks. Mand søger Kvinde) med de andres køn.
* **Alder:** Inden for brugerens angivne aldersspænd (f.eks. 25-35 år).
* **Lokation (Max Afstand):** Vises kun hvis afstanden er under brugerens max-radius (f.eks. max 50 km).

## 2. Den Vægtede Score (Soft Filters & Algoritme)
For de brugere, der slipper igennem "Hard Filters", beregnes en samlet match-score (f.eks. 0-100 points). Scoren bestemmer, hvem der vises øverst i feedet.

### A. Backgammon Kompatibilitet (40%)
* **Niveau-match (+20 pts):** Hvis de to brugere har samme niveau (f.eks. Begynder vs. Begynder), gives max point. Spil bliver sjovere, når de er jævnbyrdige. Lettere niveauforskelle giver halve point.
* **Online Status (+20 pts):** Folk der er *online lige nu* får et kæmpe boost, da appens kerne er live-spil. Brugere, der var online for nylig (inden for 24 timer), får et lille boost.

### B. Dating Kompatibilitet (40%)
* **Fælles Interesser/Tags (+20 pts):** Hvis appen på sigt får tags (f.eks. "Kaffe", "Vandreture", "Hund"), gives der point for overlap.
* **Intentioner (+20 pts):** Søger de begge noget seriøst, eller er de her bare for sjov og brætspil? Samme intention giver et stærkt boost.

### C. Aktivitet & Gamification (20%)
* **Svar-rate & Gennemførte spil (+10 pts):** Brugere der rent faktisk fuldfører deres backgammon-spil og ikke forlader kampe i utide (rage quits), prioriteres højere.
* **Nye brugere (+10 pts):** Nye profiler får et "Newbie Boost" de første 7 dage, så de hurtigt kommer i gang med at spille og møde folk.

## 3. Feedets Opbygning (UX Anbefaling)
Når brugeren scroller igennem sit matchmaking feed, bør rækkefølgen være:

1. **"Klar til spil" (Top 3-5 profiler):** Online brugere med >80% match-score. Disse vises med en grøn prik for at indikere hurtig kamp-start.
2. **"Gode Match" (Næste 10 profiler):** Brugere med høj dating-kompatibilitet, som måske er offline lige nu, men har været aktive for nylig. Man kan "Udfordre" dem (asynkron invitation).
3. **"Lidt mere modstand":** Folk der måske er et niveau højere i Backgammon, men ellers passer perfekt på dating-kriterierne.

## 4. Edge Cases & Sikkerhed
* **Anti-ghosting:** Hvis en bruger har afvist anmodninger fra en bestemt person 2 gange, skjules personen fra feedet.
* **Block/Report:** Blokerede brugere fjernes omgående på database-niveau.
* **Tomt feed:** Hvis brugerens filtre er for snævre, bør appen foreslå at udvide f.eks. afstand eller alder, og evt. vise "Wildcards" (folk der er marginalt uden for aldersspændet, men er et 100% Backgammon-match).
