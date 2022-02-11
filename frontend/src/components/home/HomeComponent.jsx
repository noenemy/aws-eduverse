import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';

const HomeComponent = (props) => {

    const [game, setGame] = useState({});

    useEffect(() => {
        console.log("@ game >> ", game)
        return ()=>{
            console.log("@ BEFORE game >> ", game)
            if(game.config) game.destroy(true, false);
            console.log("@ AFTER game >> ", game)
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