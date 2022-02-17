import Phaser from 'phaser';

export const CONFIG = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#87CEEB',
  // width: 1600,
  // height: 800,
  // autoCenter: Phaser.Scale.CENTER_BOTH,
  scale: {
    width: 1600,
    height: 800,
    // mode: Phaser.ScaleModes.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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
