import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';

const HomeComponent = (props) => {

    const [game, setGame] = useState({});

    useEffect(() => {
        return ()=>{
            if(game.config) game.destroy(true, false);
        }
    }, [game])

    return (
        <div>
            {/* Welcome to AWS Eduverse */}
            <PhaserContainer game={game} setGame={g=>setGame(g)}/>
        </div>
    );
}

export default HomeComponent;