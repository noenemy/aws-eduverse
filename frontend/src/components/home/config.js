import Phaser from 'phaser';

export const CONFIG = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#FFFFFF',
  // height: 600,
  // autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  scale: {
    width: 1200,
    // height: 600,
    mode: Phaser.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  dom: {
      createContainer: true
  },
  render: {
    pixelArt: true,  //true 하니까 눈이 넘 작아지네..
  },
  audio: {
    noAudio: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: {x:0, y:0},
      debug: false,
      // debugShowVelocity: true,
      // debugShowBody: true,
      // debugShoeStaticBody: true
    }
  },
};

export default CONFIG;
