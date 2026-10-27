# Multiplayer Survival Game MVP

A 2D multiplayer survival game built with React, TypeScript, Phaser 3, and Supabase.

## Features (MVP in progress)

- User authentication via Supabase Auth
- Procedural island generation
- 2D top-down gameplay with Phaser 3
- Fog of war / exploration system (25m radius)
- Basic movement with collision detection
- Water and swimming mechanics foundation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and add your Supabase credentials:
```bash
cp .env.example .env
```

3. Run database migrations in your Supabase project (from `supabase/migrations/`)

4. Start the development server:
```bash
npm run dev
```

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Game Engine**: Phaser 3
- **Backend/DB**: Supabase (Auth, PostgreSQL, Realtime)
- **State Management**: Zustand

## Project Structure

```
src/
  game/           # Phaser game logic
  components/     # React components
  features/       # Game features
  services/       # External services
  hooks/          # React hooks
  types/          # TypeScript types
  constants/      # Game constants
supabase/
  migrations/     # Database migrations
  functions/      # Edge functions (if needed)
```

## Development Notes

This is an MVP implementation following the technical specification. Many advanced features are planned but not yet implemented. The game uses a client-server architecture with server authority for critical operations.
