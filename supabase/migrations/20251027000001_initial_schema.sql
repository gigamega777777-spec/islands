-- Initial schema for multiplayer survival game

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS islands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seed TEXT NOT NULL,
  world_position_x DOUBLE PRECISION NOT NULL,
  world_position_y DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'abandoned')) DEFAULT 'available',
  owner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(world_position_x, world_position_y)
);

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  island_id UUID REFERENCES islands(id),
  position_x DOUBLE PRECISION DEFAULT 0,
  position_y DOUBLE PRECISION DEFAULT 0,
  health INTEGER DEFAULT 100,
  temperature INTEGER DEFAULT 20,
  status TEXT NOT NULL CHECK (status IN ('alive', 'dead')) DEFAULT 'alive',
  died_at TIMESTAMP WITH TIME ZONE,
  respawn_available_at TIMESTAMP WITH TIME ZONE,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS world_objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  island_id UUID REFERENCES islands(id) ON DELETE CASCADE,
  object_type TEXT NOT NULL,
  position_x DOUBLE PRECISION NOT NULL,
  position_y DOUBLE PRECISION NOT NULL,
  rotation DOUBLE PRECISION DEFAULT 0,
  state JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS player_discovery (
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  island_id UUID REFERENCES islands(id),
  discovered_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (player_id, island_id)
);

CREATE TABLE IF NOT EXISTS storage_containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  island_id UUID REFERENCES islands(id) ON DELETE CASCADE,
  object_id UUID REFERENCES world_objects(id) ON DELETE CASCADE,
  container_type TEXT NOT NULL,
  access_rules JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  container_id UUID REFERENCES storage_containers(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_players_island ON players(island_id);
CREATE INDEX idx_players_status ON players(status);
CREATE INDEX idx_world_objects_island ON world_objects(island_id);
CREATE INDEX idx_islands_status ON islands(status);
CREATE INDEX idx_inventory_items_player ON inventory_items(player_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE islands ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_discovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (to be refined)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view islands" ON islands FOR SELECT USING (true);
CREATE POLICY "Anyone can view active players" ON players FOR SELECT USING (true);
CREATE POLICY "Users can update own player" ON players FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own player" ON players FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own inventory" ON inventory_items FOR SELECT USING (auth.uid() IN (SELECT id FROM players WHERE players.id = inventory_items.player_id));
CREATE POLICY "Anyone can view world objects" ON world_objects FOR SELECT USING (true);
CREATE POLICY "Users can view own discovery" ON player_discovery FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can manage own discovery" ON player_discovery FOR ALL USING (auth.uid() = player_id);

CREATE POLICY "Anyone can view storage" ON storage_containers FOR SELECT USING (true);
CREATE POLICY "Anyone can view storage items" ON storage_items FOR SELECT USING (true);

CREATE POLICY "Anyone can view chat" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
