import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { gameConfig } from '../game/GameConfig';

export const Game = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      ...gameConfig,
      parent: 'game-container',
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div id="game-container" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
