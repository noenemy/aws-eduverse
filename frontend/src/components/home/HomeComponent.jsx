import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';
import Chat from '../classroom/Chat';
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

    if(user && user.id && user.nickname) {
        return (
            <Box margin={{top:"xxl"}} padding={{ top: "l" }}>
                <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                    <PhaserContainer game={game} setGame={g=>setGame(g)}/>
                    <Box margin={{left:"m", right: "m"}}>
                        <Chat />
                    </Box>
                </Grid>
            </Box>
        );
    }

    return (
        <Box margin={{top:"xxl"}} padding={{ top: "l" }}>
            <PhaserContainer game={game} setGame={g=>setGame(g)}/>
        </Box>)
}

export default HomeComponent;