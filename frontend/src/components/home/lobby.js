import Phaser from 'phaser';
import React from 'react';
import GameScene from './scenes/Game';


export default class Lobby extends React.Component {
  componentDidMount() {
    const config = {
      type: Phaser.AUTO,
      parent: 'game',
      backgroundColor: '#33A5E7',
      scale: {
        width: 500,
        height: 320,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        pixelArt: true,
      },
      audio: {
        noAudio: true,
      },
      physics: {
        default: 'arcade',
        arcade: {
          // gravity: {x:0, y:0},
          debug: true,
          debugShowVelocity: true,
          debugShowBody: true,
          debugShoeStaticBody: true
        }
      }
    }
    new Phaser.Game(Object.assign(config, {
      scene: [GameScene],
    }));
  }

  //state update 해도 재시작 안함
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id="game" />;
  }
}


