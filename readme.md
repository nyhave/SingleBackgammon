
# 🎲 Backgammon for Singles - Multiplayer Edition

En online Backgammon-app til multiplayer-kampe med real-time synkronisering via Supabase.

## 🚀 Features

- ✅ **Multiplayer Real-time** - Live game synkronisering mellem 2 spillere
- ✅ **Fuld Backgammon-implementering** - Alle standard-regler
- ✅ **Supabase Integration** - WebSocket-baseret real-time sync
- ✅ **Dansk UI** - Alt på dansk
- ✅ **Træk-historie** - Alle træk logges

## 🛠 Tech Stack

- **Frontend**: React 18 + Hooks
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Game Engine**: Custom JavaScript implementation
- **Styling**: Inline React styles

## 📦 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup Supabase (see docs/SUPABASE_SETUP.md)
# - Create project on supabase.com
# - Run SQL schema from docs/supabase-schema.sql
# - Update .env with credentials

# 3. Start app
npm start
```

## 🎮 Sådan Spilles

1. **Start**: Indtast spillernes navne → "Start Spil"
2. **Kast terning**: Tryk "🎲 Kast Terning"
3. **Træk**: Vælg punkt fra og til
4. **Switch**: Tryk "Næste Spiller" når du er færdig
5. **Vind**: Få alle 15 brikker bort først!

## 📁 Projektstruktur

```
src/
├── components/          # React komponenter
│   ├── GameBoard.jsx
│   └── MultiplayerGameController.jsx
├── engine/
│   └── BackgammonGame.js        # Game logic
├── services/
│   └── GameSyncService.js       # Supabase sync
└── supabaseClient.js

docs/
├── supabase-schema.sql          # Database setup
├── SUPABASE_SETUP.md            # Detaljeret guide
└── images/                      # Screenshots
```

## 🔗 Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/wlxnasjmrfsjqxbvsqvi
- **Setup Guide**: [SETUP.md](SETUP.md)
- **Supabase Guide**: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
- **Database Schema**: [docs/supabase-schema.sql](docs/supabase-schema.sql)

## 🌐 Real-time Multiplayer

Appen synkroniserer automatisk mellem spillere via Supabase Real-time:
- Alle træk gemmes i database
- WebSockets holder forbindelse live
- Begge spillere ser updates med det samme

## 🚧 Kommende Features

- [ ] AI opponent
- [ ] Player rating system  
- [ ] Mobile responsive
- [ ] Chat under kamp

## ⚙️ Environment Variables

```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Se `.env.example` for template.

## 📝 Code Standards

- **Engelsk**: Alle variable, funktioner, code comments
- **Dansk**: UI-labels, buttons, user messages
- Se `.instructions.md` for detaljer

**Status**: 🟡 Beta - Grundlæggende multiplayer virker

---

Sidst opdateret: 10. maj 2026