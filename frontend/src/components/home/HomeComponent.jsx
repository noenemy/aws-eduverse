import React, { useEffect, useState } from 'react';
import PhaserContainer from './PhaserContainer';
import Chat from '../chat/Chat';

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