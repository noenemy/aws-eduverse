import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';
import Chat from '../chat/Chat';

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
            <div className="row">
                <div className="col-sm-9">
                    <PhaserContainer game={game} setGame={g=>setGame(g)}/>
                </div>
                <div className="col-sm-3">
                    <Chat />
                </div>
            </div>

        </div>
    );
}

export default HomeComponent;