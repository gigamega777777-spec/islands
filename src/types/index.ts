export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
}

export interface Island {
  id: string;
  seed: string;
  world_position_x: number;
  world_position_y: number;
  status: 'available' | 'occupied' | 'abandoned';
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  island_id: string;
  position_x: number;
  position_y: number;
  health: number;
  temperature: number;
  status: 'alive' | 'dead';
  died_at: string | null;
  respawn_available_at: string | null;
  last_seen_at: string;
}

export interface InventoryItem {
  id: string;
  player_id: string;
  item_type: string;
  quantity: number;
  metadata: Record<string, any> | null;
}

export interface WorldObject {
  id: string;
  island_id: string;
  object_type: string;
  position_x: number;
  position_y: number;
  rotation: number;
  state: Record<string, any> | null;
}

export interface DiscoveredArea {
  player_id: string;
  island_id: string | null;
  discovered_data: Record<string, any>;
}
