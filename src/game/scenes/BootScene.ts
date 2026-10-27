import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create simple placeholder graphics
    this.createPlaceholderGraphics();
  }

  create() {
    this.scene.start('GameScene');
  }

  createPlaceholderGraphics() {
    // Player
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0x00ff00, 1);
    playerGraphics.fillCircle(16, 16, 16);
    playerGraphics.generateTexture('player', 32, 32);
    playerGraphics.destroy();

    // Water
    const waterGraphics = this.add.graphics();
    waterGraphics.fillStyle(0x0066cc, 1);
    waterGraphics.fillRect(0, 0, 32, 32);
    waterGraphics.generateTexture('water', 32, 32);
    waterGraphics.destroy();

    // Grass/Sand
    const grassGraphics = this.add.graphics();
    grassGraphics.fillStyle(0x4a7c59, 1);
    grassGraphics.fillRect(0, 0, 32, 32);
    grassGraphics.generateTexture('grass', 32, 32);
    grassGraphics.destroy();

    // Tree
    const treeGraphics = this.add.graphics();
    treeGraphics.fillStyle(0x2d4f1e, 1);
    treeGraphics.fillRect(8, 8, 16, 24);
    treeGraphics.fillStyle(0x8b4513, 1);
    treeGraphics.fillRect(14, 24, 4, 8);
    treeGraphics.generateTexture('tree', 32, 32);
    treeGraphics.destroy();
  }
}
