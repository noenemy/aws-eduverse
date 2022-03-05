import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';
import Chat from './Chat';
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/user/userState';
import { Box, Grid } from '@awsui/components-react';
import ScrollToTop from './ScrollToTop';

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
            <ScrollToTop>
                <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                    <PhaserContainer game={game} setGame={g=>setGame(g)}/>
                    <Box margin={{left:"m", right: "m"}}>
                        <Chat title={"lobby"}/>
                    </Box>
                </Grid>
            </ScrollToTop>
        );
    }

    return (
        <PhaserContainer game={game} setGame={g=>setGame(g)}/>
    )
}

export default HomeComponent;