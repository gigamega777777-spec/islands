import Phaser from 'phaser';
import { GAME_CONFIG, getExplorationRadiusPixels } from '../../constants';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private map!: Phaser.Tilemaps.Tilemap;
  private waterLayer: any;
  private fog!: Phaser.GameObjects.Graphics;
  private exploredTiles: Set<string> = new Set();

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.createMap();
    this.createPlayer();
    this.setupCamera();
    this.setupInput();
    this.createFogOfWar();
  }

  update() {
    this.handlePlayerMovement();
    this.updateFogOfWar();
  }

  createMap() {
    // Create a simple tilemap
    const mapData = [];
    const mapWidth = 50;
    const mapHeight = 50;
    
    for (let y = 0; y < mapHeight; y++) {
      const row = [];
      for (let x = 0; x < mapWidth; x++) {
        // Simple island generation - center area is grass, edges near water
        const centerX = mapWidth / 2;
        const centerY = mapHeight / 2;
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (dist < 12) {
          row.push(1); // grass
        } else if (dist < 15) {
          row.push(0); // water edge
        } else {
          row.push(0); // water
        }
      }
      mapData.push(row);
    }

    this.map = this.make.tilemap({ data: mapData, tileWidth: GAME_CONFIG.TILE_SIZE, tileHeight: GAME_CONFIG.TILE_SIZE });
    const grassTiles = this.map.addTilesetImage('grass', 'grass');
    const waterTiles = this.map.addTilesetImage('water', 'water');
    
    if (grassTiles && waterTiles) {
      this.waterLayer = this.map.createLayer(0, [grassTiles, waterTiles], 0, 0);
      if (this.waterLayer) {
        // Set collision for water
        this.map.setCollision(0, true, true, this.waterLayer);
      }
    }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(800, 800, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(24, 24);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
  }

  setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  createFogOfWar() {
    this.fog = this.add.graphics();
    this.fog.setScrollFactor(0);
    this.fog.fillStyle(0x000000, 0.8);
    this.fog.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
  }

  updateFogOfWar() {
    const radius = getExplorationRadiusPixels();
    const cam = this.cameras.main;
    const playerScreenX = this.player.x - cam.scrollX;
    const playerScreenY = this.player.y - cam.scrollY;

    // Clear and redraw fog with a hole around player
    this.fog.clear();
    this.fog.fillStyle(0x000000, 0.8);
    this.fog.fillRect(0, 0, cam.width, cam.height);
    
    // Create circular hole
    this.fog.fillStyle(0x000000, 0);
    this.fog.beginPath();
    this.fog.arc(playerScreenX, playerScreenY, radius, 0, Math.PI * 2);
    this.fog.fillPath();
    this.fog.closePath();
    
    // Mark explored area (simplified - would save to DB in full implementation)
    const tileX = Math.floor(this.player.x / GAME_CONFIG.TILE_SIZE);
    const tileY = Math.floor(this.player.y / GAME_CONFIG.TILE_SIZE);
    const key = `${tileX},${tileY}`;
    this.exploredTiles.add(key);
  }

  handlePlayerMovement() {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    // Check if in water (simplified)
    const inWater = false;
    const speed = inWater ? GAME_CONFIG.PLAYER_SPEED_SWIM : GAME_CONFIG.PLAYER_SPEED_WALK;

    if (this.cursors.left?.isDown || this.wasd.A.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown || this.wasd.D.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up?.isDown || this.wasd.W.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down?.isDown || this.wasd.S.isDown) {
      body.setVelocityY(speed);
    }

    body.velocity.normalize().scale(speed);
  }
}
