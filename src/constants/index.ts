export const GAME_CONFIG = {
  TILE_SIZE: 32,
  EXPLORATION_RADIUS_METERS: 25,
  // Conversion: assuming 1 meter = 32 pixels for simplicity (can be adjusted)
  METERS_TO_PIXELS: 32,
  PLAYER_SPEED_WALK: 150,
  PLAYER_SPEED_SWIM: 100,
  RESPAWN_HOURS: 24,
} as const;

export const getExplorationRadiusPixels = () => 
  GAME_CONFIG.EXPLORATION_RADIUS_METERS * GAME_CONFIG.METERS_TO_PIXELS;
