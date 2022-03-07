import React, { useEffect, useRef, useState } from 'react';
import PhaserContainer from './PhaserContainer';
import Chat from './Chat';
import { useRecoilState, useRecoilValue } from 'recoil';
import { allUserState, userState } from '../../recoil/user/userState';
import { Box, Grid, TextContent } from '@awsui/components-react';
import ScrollToTop from './ScrollToTop';
import { API, graphqlOperation } from 'aws-amplify';
import { listTutees } from '../../graphql/queries';

const HomeComponent = (props) => {

    const [game, setGame] = useState({});
    const user = useRecoilValue(userState);
    const [allUsers, setAllUsers] = useRecoilState(allUserState);
    const [usersInLobby, setUsersInLobby] = useState(0);

    const lobbyUserCounter = useRef(null);

    //로비 사용자수 업뎃 스케줄러 10초
    useEffect(() => {
        lobbyUserCounter.current = setInterval( async ()=>{
            if(user && user.id) {
                const allTutees = await getAllUsers();
                setAllUsers(allTutees);
            }
        }, 10000);
        return () => clearInterval(lobbyUserCounter.current);
    }, [])
    
    useEffect(() => {
        // console.log("@ HomeComponent allUsers >> ", allUsers)
        setUsersInLobby(allUsers.filter(item => item.lastVisit === 'lobby').length);

    }, [allUsers])


    useEffect(() => {
        return ()=>{
            if(game.config) game.destroy(true, false);
        }
    }, [game])

    const getAllUsers = async () => {
        const allData = await API.graphql(graphqlOperation(listTutees));
        const allTutees = Array.from(allData.data.listTutees.items);
        
        return allTutees;
    }

    if(user && user.id && user.nickname) {
        return (
            <ScrollToTop>
                <Grid gridDefinition={[{ colspan: 9 }, { colspan: 3 }]}>
                    <PhaserContainer game={game} setGame={g=>setGame(g)}/>
                    <Box margin={{left:"m", right: "m"}}>
                        <TextContent><h2>{usersInLobby}명의 친구들이 로비에 있어요.</h2></TextContent>
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