import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import VideoPlayer from './VideoPlayer';
import Chat from '../classroom/Chat';
import { API, graphqlOperation } from 'aws-amplify';
import { getAuditorium, listAuditoriums } from '../../graphql/queries';
import ScrollToTop from '../home/ScrollToTop';

function Auditorium() {
    const { id } = useParams();
    const [ url, setUrl ] = useState("");
    const [ auditorium, setAuditorium ] = useState();
    const navigate = useNavigate();

    useEffect(async () => {
        if (id) {
            const result = await API.graphql(graphqlOperation(getAuditorium, {id}));
            setUrl(result.data.getAuditorium.url);
            console.log("@getAuditorium > " + url);
        }
    }, []);

    return (
        <ScrollToTop>
            <div className="row">
                <div className="col-sm-9">
                    <div>
                        <span>auditorium { id }</span> 
                        <Button variant="primary" onClick={() => navigate(-1)}>Exit</Button> 
                    </div>
                    { url && 
                        <VideoPlayer url={ url } />
                    }  
                    
                </div>
                <div className="col-sm-3">
                    <Chat />
                </div>
            </div>
        </ScrollToTop>
    );
}

export default Auditorium;