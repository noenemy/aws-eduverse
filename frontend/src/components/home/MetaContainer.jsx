import Phaser from 'phaser';
import React, { useEffect, useMemo } from 'react';

import Lobby from './scenes/Lobby';
import Login from './scenes/Login';

const MetaContainer = props => {

  useEffect(() => {
    
    const config = {
      type: Phaser.AUTO,
      parent: 'game',
      backgroundColor: '#87CEEB',
      width: 1200,
      height: 800,
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      // scale: {
      //   width: 800,
      //   height: 600,
      //   // mode: Phaser.Scale.FIT,
      //   autoCenter: Phaser.Scale.CENTER_BOTH,
      // },
      dom: {
          createContainer: true
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
      },
      scene: [
        new Login(),
        new Lobby()
      ]
    }

    const game = new Phaser.Game(config);

    return () => {
      // delete game;
    }
  }, []);

  //state update 해도 재시작 안함
  // shouldComponentUpdate() {
  //   return false;
  // }
 
  return <div id="game" style={{height:'100vh', weight:'100%', backgroundColor:'#87CEEB'/*'#CDCDCD'*/, overflow: 'hidden'}}/>;
}

export default MetaContainer;
