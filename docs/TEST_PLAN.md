# Struktureret Test-plan: Backgammon Hearts Platform

Denne dokumentation beskriver strategien for at teste applikationen, med fokus på platformens kerne-funktionalitet (infrastruktur), der er uafhængig af det specifikke spil.

## 1. Test-arkitektur
Vi anvender en "Separation of Concerns" strategi:
- **Platform Core**: Matchmaking, synkronisering, chat, profilhåndtering og statistik.
- **Game Engine**: Specifik spillogik (f.eks. Backgammon regler).

## 2. Platform Infrastruktur (Høj Prioritet)

### 2.1 Matchmaking & Session
| Test Case | Beskrivelse | Forventet Resultat |
| :--- | :--- | :--- |
| **Login Flow** | Bruger indtaster navn og vælger 'Log ind' | Brugeren lander på matchmaking skærmen med korrekt navn gemt. |
| **Join via Link** | Bruger åbner URL med `?gameId=...` | Appen genkender ID'et og sender brugeren direkte til det korrekte spil efter login. |
| **Clean Exit** | Bruger afslutter spil og går til forsiden | `gameId` fjernes fra URL, så næste session starter frisk. |

### 2.2 Real-time Synkronisering (Supabase)
| Test Case | Beskrivelse | Forventet Resultat |
| :--- | :--- | :--- |
| **State Push** | Spiller A laver en handling (f.eks. et træk) | Databasen opdateres med korrekt JSON state. |
| **State Pull** | Spiller B er på samme spil | Spiller B modtager automatisk opdateringen via real-time subscription. |
| **Conflict Handling** | To spillere agerer samtidigt | Platformen skal håndtere dette via Supabase's seneste state eller optimisme-logik. |

### 2.3 Statistik & Tracking
| Test Case | Beskrivelse | Forventet Resultat |
| :--- | :--- | :--- |
| **Game Start Log** | Et nyt spil oprettes | `created_at` logges i `games` tabellen. |
| **Game Finish Log** | Et spil afsluttes | `finished_at` logges og status sættes til `finished`. |
| **Stats Calculation** | Admin åbner StatsScreen | Gennemsnitstider og funnel-data beregnes korrekt ud fra DB logs. |

## 3. Spil-specifik Test (Sekundær Prioritet)

### 3.1 Backgammon Logik
- **Move Validation**: Kan brikker kun flyttes til gyldige felter?
- **Bar Logic**: Skal man flytte fra bar, hvis man er slået hjem?
- **Bear-off**: Kan man tage brikker ud i slutspillet?
- **AI Execution**: Kan AI'en gennemføre et fuldt spil i Admin Mode?

## 4. Test Metoder

### 4.1 Manuel "To-Browser" Test
Dette er den vigtigste test for multiplayer:
1. Åbn `localhost:3000` i to forskellige vinduer (eller ét normalt og ét inkognito).
2. Start et spil i vindue A.
3. Kopier URL'en til vindue B.
4. Verificer at handlinger i vindue A øjeblikkeligt afspejles i vindue B.

### 4.2 Automatiserede Unit Tests
Kørsel af `npm test` vil eksekvere:
- `src/__tests__/GameSyncService.test.js`: Tester platformens hjerte.
- `src/__tests__/BackgammonGame.test.js`: Tester spillets hjerne.

## 5. Debugging Værktøjer
I **Admin Mode** er følgende tilgængeligt for testere:
- **Auto-play**: Lad AI'en teste spillets flow hurtigt.
- **Konsol-logs**: Se præcis hvilke JSON-pakker der sendes til Supabase.
