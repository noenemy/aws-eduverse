import Phaser from 'phaser';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { sceneState } from '../../recoil/phaser/sceneState';
import { userState } from '../../recoil/user/userState';
// import OutlinePipeline from './entities/OutlinePipeline';

import Lobby from './scenes/Lobby';
import Login from './scenes/Login';

function PhaserContainer (props) {

  const [user, setUser] = useRecoilState(userState);
  // const [gameId, setGameId] = useState(`game${new Date().getTime()}`);

  useEffect(()=> {
    console.log("@ PhaserContainer.user >>>  ", user);
    console.log("@ PhaserContainer.props >>>  ", props);

    const config = {
      type: Phaser.AUTO,
      parent: 'game',
      backgroundColor: '#87CEEB',
      // width: 1200,
      // height: 800,
      // autoCenter: Phaser.Scale.CENTER_BOTH,
      scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      dom: {
          createContainer: true
      },
      render: {
        pixelArt: false,  //true 하니까 눈이 넘 작아지네..
      },
      audio: {
        noAudio: true,
      },
      physics: {
        default: 'arcade',
        arcade: {
          // gravity: {x:0, y:0},
          debug: true,
          // debugShowVelocity: true,
          // debugShowBody: true,
          // debugShoeStaticBody: true
        }
      },
      scene: user && user.id ? [
        new Lobby({
          newTutee: user,
          nickname: user.nickname
        })
      ]
      : [
        new Login(user, (user) => setUser(user)),
        new Lobby({
          newTutee: user,
          nickname: user.nickname
        })]
    };

    const game = new Phaser.Game(config);
    props.setGame(game);

    return () => {

    }    
  },[])

  //state update 해도 재시작 안함
  // shouldComponentUpdate() {
  //   return false;
  // }
 
  return <div id='game' style={{height:'100vh', weight:'100%', backgroundColor:'#87CEEB'/*'#CDCDCD'*/, }}/>;
}

export default PhaserContainer;