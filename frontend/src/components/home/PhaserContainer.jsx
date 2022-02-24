import Phaser from 'phaser';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { allUserState, userState } from '../../recoil/user/userState';
import CONFIG from './config';
// import OutlinePipeline from './entities/OutlinePipeline';

import Lobby from './scenes/Lobby';
import Login from './scenes/Login';
// import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

function PhaserContainer (props) {

  const [user, setUser] = useRecoilState(userState);
  const [allUsers, setAllUsers] = useRecoilState(allUserState);
  const navigate = useNavigate();

  useEffect(()=> {
    const loginScene = new Login(user, (user) => setUser(user), allUsers, (all) => setAllUsers(all));

    const lobbyScene = new Lobby({
      newTutee: user,
      nickname: user.nickname,
      navigate: navigate,
      allUsers: allUsers,
      setAllUsers: all => setAllUsers(all),
    });

    const config = { 
      ...CONFIG,
      scene: user && user.id ? 
      [
        lobbyScene,
      ]
      : [
        loginScene,
        lobbyScene,
      ],
      // plugins: {
      //   scene: [{
      //       key: 'rexUI',
      //       plugin: RexUIPlugin,
      //       mapping: 'rexUI'
      //   }]
      // }
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