import Phaser from 'phaser';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { allUserState, userState } from '../../recoil/user/userState';
import CONFIG from './config';

import Splash from './scenes/Splash';
import Lobby from './scenes/Lobby';
import Login from './scenes/Login';
import Dialog from './scenes/Dialog';

function PhaserContainer (props) {

  const [user, setUser] = useRecoilState(userState);
  const [allUsers, setAllUsers] = useRecoilState(allUserState);
  const navigate = useNavigate();

  useEffect(()=> {
    const splashScene = new Splash();

    const loginScene = new Login(user, (user) => setUser(user), allUsers, (all) => setAllUsers(all));

    const lobbyScene = new Lobby({
      newTutee: user,
      nickname: user.nickname,
      navigate: navigate,
      allUsers: allUsers,
      setAllUsers: all => setAllUsers(all),
    });

    const dialogScene = new Dialog();

    const config = { 
      ...CONFIG,
      scene: user && user.id ? 
      [
        lobbyScene, dialogScene
      ]
      : [
        //splashScene, loginScene, lobbyScene, dialogScene /* Splash 씬 작업을 위해 임시 커멘트 처리
        splashScene
      ],
      plugins: {
        global: [ 
          // {
          //   key: "DialogModalPlugin",
          //   plugin: DialogModalPlugin,
          //   start: true,
          //   mapping: "dialog"
          // }
        ],
        scene: [
        ]
      }
    };

    const game = new Phaser.Game(config);
    props.setGame(game);

  },[]);

  //state update 해도 재시작 안함
  // shouldComponentUpdate() {
  //   return false;
  // }
 
  return <div id='game' style={{width: user && user.id ? '75vw' : '100vw'}}/>;
}

export default PhaserContainer;