import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';
import Chat from '../chat/Chat';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';
import { Box, Grid } from '@awsui/components-react';

const HomeComponent = (props) => {

    const [game, setGame] = useState({});
    const user = useRecoilValue(userState);

    useEffect(() => {
        return ()=>{
            if(game.config) game.destroy(true, false);
        }
    }, [game])

    if(user && user.id) {
        return (
            // <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                <PhaserContainer game={game} setGame={g=>setGame(g)}/>
                //챗 임시 제외
            // </Grid>
        );
    }

    return (
    <React.Fragment>
        <PhaserContainer game={game} setGame={g=>setGame(g)}/>
    </React.Fragment>)
}

export default HomeComponent;