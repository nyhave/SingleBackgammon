# Backgammon Multiplayer - Setup Guide

## 🎯 Overview

Dette er en multiplayer Backgammon-app bygget med:
- **React** - Frontend framework
- **Supabase** - Backend + real-time database
- **Custom Game Engine** - Backgammon-regler implementeret i JavaScript
- **WebSockets** - Real-time synkronisering mellem spillere

## 🚀 Hurtig Start

### 1. Database Setup (Supabase)

1. Gå til [Supabase Dashboard](https://app.supabase.com)
2. Åbn din project SQL Editor
3. Kør SQL-skriptet fra `docs/supabase-schema.sql`

Dette opretter:
- `games` - Aktive spil
- `game_moves` - Træk-historie
- `players` - Spiller-profiler
- `game_results` - Statistik

### 2. Environment Variables

Din `.env` fil skal indeholde (allerede sat op):
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Appen

```bash
npm install
npm start
```

Appen åbner på `http://localhost:3000`

## 🎲 Sådan Virker Det

### Game Flow

1. **Opstart**: Indtast spillernes navne → Start Spil
2. **Terningkast**: Tryk "Kast Terning" for at rulle
3. **Træk**: Vælg punkt → Træk brikke til nyt punkt
4. **Switch**: Næste spiller trykker "Næste Spiller"
5. **Vinderkriterium**: Første spiller med 15 brikker bort vinder

### Real-time Sync

- Alle træk synkroniseres via Supabase Real-time
- Begge spillere ser updates med det samme
- Træk-historie gemmes i `game_moves` tabel
- Game-state uppdateres i `games` tabel

### Backgammon Regler

- 24 punkter på brættet
- Hver spiller starter med 15 brikker
- Standardopstillinger som i rigtig Backgammon
- Bankeringen håndteres automatisk
- Afbæring (bearing off) når alle brikker er i hjemmet

## 📁 Projektstruktur

```
src/
├── components/
│   ├── GameBoard.jsx           # Visning af brættet
│   └── MultiplayerGameController.jsx  # Game-controller
├── engine/
│   └── BackgammonGame.js       # Game engine
├── services/
│   └── GameSyncService.js      # Supabase sync
├── App.jsx
├── index.js
└── supabaseClient.js
```

## 🔧 Vigtige Filer

| Fil | Formål |
|-----|--------|
| `src/engine/BackgammonGame.js` | Implementerer Backgammon-regler |
| `src/services/GameSyncService.js` | Synkroniserer med Supabase |
| `src/components/GameBoard.jsx` | Tegner brættet |
| `docs/supabase-schema.sql` | Database-schema |

## 🌟 Features

✅ Multiplayer via Supabase Real-time  
✅ Fuld Backgammon-regelimplementering  
✅ Live game synkronisering  
✅ Træk-historie logging  
✅ Vinder-detektion  
✅ Dansk UI-tekst  

## 🚨 Troubleshooting

### "Connection failed"
- Tjek at `.env` variabler er korrekte
- Verificer Supabase API key

### Game updates ikke live
- Tjek at Real-time er aktiveret i Supabase
- Klik på `games` tabel → Realtime settings → Enable

### Tabeller mangler
- Kør SQL-skriptet fra `docs/supabase-schema.sql` igen

## 📱 Næste Steps

- [ ] Implementer AI-modstander
- [ ] Tilføj player rating system
- [ ] Chat under spil
- [ ] Match history / statistik

## 💡 Tips

- Test med 2 browser-windows (split screen) for at se real-time sync
- Tjek Supabase logs hvis noget går galt
- Game state gemmes som JSON - easy at debugge

Enjoy! 🎉
